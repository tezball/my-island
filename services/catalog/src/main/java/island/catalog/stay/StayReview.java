package island.catalog.stay;

import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

/** Fail-closed review in order: tech, then fit, then conduct. */
public final class StayReview {

  public static final Set<String> KINDS =
      Set.of("campsite", "bed and breakfast", "apartment", "glamping", "lodge");

  static final String BAN_MARKUP = "Banned for script or markup in the text.";
  static final String BAN_FILE = "Banned for a file that is not a photo.";
  static final String BAN_ILLEGAL = "Banned for illegal content.";

  private static final Pattern MARKUP =
      Pattern.compile("(?i)<\\s*/?\\s*[a-z!]|javascript\\s*:|\\bon[a-z]{3,}\\s*=");

  private static final String[] STAY_WORDS = {
    "stay",
    "staying",
    "overnight",
    "guest",
    "pitch",
    "tent",
    "room",
    "bed",
    "breakfast",
    "apartment",
    "glamping",
    "lodge",
    "campsite",
    "accommodation",
    "cabin",
    "bunk",
    "caravan",
    "night"
  };

  private static final String[] ILLEGAL = {"child porn", "csam"};

  private StayReview() {}

  public record Draft(
      String kind,
      String title,
      String description,
      String cost,
      String phone,
      String email,
      String website,
      Double latitude,
      Double longitude,
      String countyId,
      List<byte[]> images) {}

  public record Result(
      String status, String review, String feedback, boolean ban, String banReason) {

    static Result pass() {
      return new Result("public", "pass", null, false, null);
    }

    static Result feedback(String message) {
      return new Result("hidden", "fail", message, false, null);
    }

    static Result ban(String reason) {
      return new Result("hidden", "fail", reason, true, reason);
    }
  }

  @FunctionalInterface
  public interface Pages {
    String load(String url) throws java.io.IOException;
  }

  public static Result review(Draft draft, Pages pages, boolean allowLocalWebsites) {
    String text = join(draft.title(), draft.description(), draft.phone(), draft.email());
    if (MARKUP.matcher(text).find()) {
      return Result.ban(BAN_MARKUP);
    }
    for (byte[] image : draft.images()) {
      ImageCrop.PhotoCheck check = ImageCrop.check(image);
      if (check == ImageCrop.PhotoCheck.NOT_A_PHOTO) {
        return Result.ban(BAN_FILE);
      }
      if (check == ImageCrop.PhotoCheck.UNREADABLE) {
        return Result.feedback("Photos have to be JPEG or PNG.");
      }
    }
    String website = blankToNull(draft.website());
    if (website != null && !normalUrl(website, allowLocalWebsites)) {
      return Result.feedback("The website has to be a normal http or https URL.");
    }

    if (!KINDS.contains(blank(draft.kind()))) {
      return Result.feedback(
          "Kind has to be campsite, bed and breakfast, apartment, glamping, or lodge.");
    }
    if (blank(draft.title()).isEmpty() || blank(draft.description()).isEmpty()) {
      return Result.feedback("Title and description are required.");
    }
    if (draft.images() == null || draft.images().isEmpty() || draft.images().size() > 8) {
      return Result.feedback("A Stay needs at least 1 photo and at most 8.");
    }
    if (draft.latitude() == null || draft.longitude() == null || blank(draft.countyId()).isEmpty()) {
      return Result.feedback(
          "The pin has to be in Ireland. The county comes from the pin and must be one of the 32 Irish counties.");
    }
    if (!validCost(draft.cost())) {
      return Result.feedback("Cost, when you add it, is a number of euro.");
    }
    if (website != null) {
      String page;
      try {
        page = pages.load(website);
      } catch (Exception ex) {
        return Result.feedback("The website did not load. A down site fails review until it loads.");
      }
      if (page == null || !readsAsStay(stripTags(page))) {
        return Result.feedback("The website does not read as a place to stay.");
      }
    }

    String prose = (blank(draft.title()) + " " + blank(draft.description())).toLowerCase(Locale.ROOT);
    if (illegal(prose)) {
      return Result.ban(BAN_ILLEGAL);
    }
    if (!readsAsStay(prose)) {
      return Result.feedback(
          "This does not read as a place to stay. Say what a guest stays in, then submit again.");
    }
    if (blank(draft.description()).length() < 40) {
      return Result.feedback(
          "This Stay needs a clearer description before it can be public. Say what a guest stays in, then submit again.");
    }
    return Result.pass();
  }

  private static boolean illegal(String prose) {
    for (String term : ILLEGAL) {
      if (prose.contains(term)) {
        return true;
      }
    }
    return false;
  }

  private static boolean readsAsStay(String prose) {
    String lower = prose.toLowerCase(Locale.ROOT);
    for (String word : STAY_WORDS) {
      if (lower.contains(word)) {
        return true;
      }
    }
    return false;
  }

  private static boolean validCost(String cost) {
    if (cost == null || cost.isBlank()) {
      return true;
    }
    try {
      return new BigDecimal(cost.trim()).signum() >= 0;
    } catch (NumberFormatException ex) {
      return false;
    }
  }

  static boolean normalUrl(String website, boolean allowLocalWebsites) {
    try {
      URI uri = URI.create(website.trim());
      String scheme = uri.getScheme();
      if (scheme == null
          || !(scheme.equalsIgnoreCase("http") || scheme.equalsIgnoreCase("https"))) {
        return false;
      }
      if (uri.getUserInfo() != null || uri.getHost() == null || uri.getHost().isBlank()) {
        return false;
      }
      if (!allowLocalWebsites && localHost(uri.getHost())) {
        return false;
      }
      return true;
    } catch (IllegalArgumentException ex) {
      return false;
    }
  }

  private static boolean localHost(String host) {
    String name = host.toLowerCase(Locale.ROOT);
    if (name.equals("localhost")
        || name.endsWith(".localhost")
        || name.equals("0.0.0.0")
        || name.equals("::1")) {
      return true;
    }
    boolean numeric = name.chars().allMatch(ch -> Character.isDigit(ch) || ch == '.' || ch == ':');
    if (!numeric) {
      return false;
    }
    try {
      InetAddress address = InetAddress.getByName(name);
      return address.isAnyLocalAddress()
          || address.isLoopbackAddress()
          || address.isLinkLocalAddress()
          || address.isSiteLocalAddress();
    } catch (Exception ex) {
      return true;
    }
  }

  private static String stripTags(String html) {
    return html.replaceAll("(?i)<[^>]+>", " ");
  }

  private static String join(String... parts) {
    StringBuilder out = new StringBuilder();
    for (String part : parts) {
      if (part != null) {
        out.append(' ').append(part);
      }
    }
    return out.toString();
  }

  private static String blank(String value) {
    return value == null ? "" : value.trim();
  }

  private static String blankToNull(String value) {
    String trimmed = blank(value);
    return trimmed.isEmpty() ? null : trimmed;
  }
}
