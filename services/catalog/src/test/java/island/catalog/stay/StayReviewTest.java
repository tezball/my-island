package island.catalog.stay;

import static org.assertj.core.api.Assertions.assertThat;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.List;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;

class StayReviewTest {

  @Test
  void cleanCampsitePasses() throws Exception {
    StayReview.Result result =
        StayReview.review(draft("A quiet lake", longStayText(), null, photo(), "kerry"), url -> "", true);
    assertThat(result.status()).isEqualTo("public");
    assertThat(result.review()).isEqualTo("pass");
    assertThat(result.ban()).isFalse();
  }

  @Test
  void scriptInTheDescriptionBansBeforeFit() {
    StayReview.Result result =
        StayReview.review(
            draft("Lake", "<script>alert(1)</script> guests stay overnight here in a tent.", null, photo(), "kerry"),
            url -> {
              throw new AssertionError("fit must not run after markup");
            },
            true);
    assertThat(result.ban()).isTrue();
    assertThat(result.status()).isEqualTo("hidden");
    assertThat(result.banReason()).isEqualTo(StayReview.BAN_MARKUP);
  }

  @Test
  void svgIsABan() {
    byte[] svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>".getBytes();
    StayReview.Result result =
        StayReview.review(draft("Lake", longStayText(), null, svg, "kerry"), url -> "", true);
    assertThat(result.banReason()).isEqualTo(StayReview.BAN_FILE);
  }

  @Test
  void downWebsiteIsFeedbackNotABan() {
    StayReview.Result result =
        StayReview.review(
            draft("Lake", longStayText(), "http://127.0.0.1:9/stay", photo(), "kerry"),
            url -> {
              throw new java.io.IOException("down");
            },
            true);
    assertThat(result.ban()).isFalse();
    assertThat(result.status()).isEqualTo("hidden");
    assertThat(result.feedback()).contains("did not load");
  }

  @Test
  void pinOutsideIrelandIsFeedback() {
    StayReview.Result result =
        StayReview.review(draft("Lake", longStayText(), null, photo(), null), url -> "", true);
    assertThat(result.ban()).isFalse();
    assertThat(result.feedback()).contains("32 Irish counties");
  }

  @Test
  void offTopicIsFeedback() {
    StayReview.Draft draft =
        new StayReview.Draft(
            "apartment",
            "Town flat",
            "Quarterly widgets, invoices, and a parking memo for the office.",
            null,
            null,
            null,
            null,
            53.35,
            -6.26,
            "dublin",
            List.of(photo()));
    StayReview.Result result = StayReview.review(draft, url -> "", true);
    assertThat(result.ban()).isFalse();
    assertThat(result.feedback()).contains("place to stay");
  }

  @Test
  void coverCropsTo1600By900() throws Exception {
    ImageCrop.Cropped cover = ImageCrop.crop(photo(), true);
    ImageCrop.Cropped other = ImageCrop.crop(photo(), false);
    BufferedImage coverImage = ImageIO.read(new java.io.ByteArrayInputStream(cover.jpeg()));
    BufferedImage otherImage = ImageIO.read(new java.io.ByteArrayInputStream(other.jpeg()));
    assertThat(coverImage.getWidth()).isEqualTo(1600);
    assertThat(coverImage.getHeight()).isEqualTo(900);
    assertThat(otherImage.getWidth()).isEqualTo(1200);
    assertThat(otherImage.getHeight()).isEqualTo(800);
  }

  private static StayReview.Draft draft(
      String title, String description, String website, byte[] image, String countyId) {
    return new StayReview.Draft(
        "campsite",
        title,
        description,
        null,
        null,
        null,
        website,
        52.06,
        -9.50,
        countyId,
        List.of(image));
  }

  private static String longStayText() {
    return "A quiet campsite with pitches for tents. Guests stay overnight beside the lake and wake to birdsong.";
  }

  private static byte[] photo() {
    try {
      BufferedImage image = new BufferedImage(40, 20, BufferedImage.TYPE_INT_RGB);
      Graphics2D graphics = image.createGraphics();
      graphics.setColor(Color.GREEN);
      graphics.fillRect(0, 0, 40, 20);
      graphics.dispose();
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      ImageIO.write(image, "jpg", out);
      return out.toByteArray();
    } catch (Exception ex) {
      throw new IllegalStateException(ex);
    }
  }
}
