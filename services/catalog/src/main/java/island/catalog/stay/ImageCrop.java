package island.catalog.stay;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.imageio.ImageIO;

/** Cover is 1600×900. Every other photo is 1200×800. */
public final class ImageCrop {

  public static final int COVER_WIDTH = 1600;
  public static final int COVER_HEIGHT = 900;
  public static final int OTHER_WIDTH = 1200;
  public static final int OTHER_HEIGHT = 800;

  public enum PhotoCheck {
    PHOTO,
    NOT_A_PHOTO,
    UNREADABLE
  }

  public record Cropped(byte[] jpeg, int width, int height) {}

  private ImageCrop() {}

  public static PhotoCheck check(byte[] raw) {
    if (raw == null || raw.length < 8) {
      return PhotoCheck.NOT_A_PHOTO;
    }
    if (markupOrExecutable(raw)) {
      return PhotoCheck.NOT_A_PHOTO;
    }
    boolean known = jpeg(raw) || png(raw) || gif(raw) || webp(raw);
    BufferedImage image = read(raw);
    if (image != null && known) {
      return PhotoCheck.PHOTO;
    }
    if (known) {
      return PhotoCheck.UNREADABLE;
    }
    return PhotoCheck.NOT_A_PHOTO;
  }

  public static Cropped crop(byte[] raw, boolean cover) {
    BufferedImage src = read(raw);
    if (src == null) {
      throw new IllegalArgumentException("Not a photo");
    }
    int tw = cover ? COVER_WIDTH : OTHER_WIDTH;
    int th = cover ? COVER_HEIGHT : OTHER_HEIGHT;
    int sw = src.getWidth();
    int sh = src.getHeight();
    double target = tw / (double) th;
    double aspect = sw / (double) sh;
    int cw;
    int ch;
    if (aspect > target) {
      ch = sh;
      cw = Math.max(1, (int) Math.round(ch * target));
    } else {
      cw = sw;
      ch = Math.max(1, (int) Math.round(cw / target));
    }
    int cx = Math.max(0, (sw - cw) / 2);
    int cy = Math.max(0, (sh - ch) / 2);
    cw = Math.min(cw, sw - cx);
    ch = Math.min(ch, sh - cy);
    BufferedImage cropped = src.getSubimage(cx, cy, cw, ch);
    BufferedImage out = new BufferedImage(tw, th, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = out.createGraphics();
    graphics.setRenderingHint(
        RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    graphics.drawImage(cropped, 0, 0, tw, th, null);
    graphics.dispose();
    try {
      ByteArrayOutputStream bytes = new ByteArrayOutputStream();
      if (!ImageIO.write(out, "jpg", bytes)) {
        throw new IllegalStateException("JPEG writer missing");
      }
      return new Cropped(bytes.toByteArray(), tw, th);
    } catch (IOException ex) {
      throw new IllegalStateException("Could not write the photo", ex);
    }
  }

  private static boolean markupOrExecutable(byte[] raw) {
    int n = Math.min(raw.length, 512);
    String head = new String(raw, 0, n, StandardCharsets.ISO_8859_1).trim().toLowerCase();
    if (head.startsWith("<svg")
        || head.startsWith("<?xml")
        || head.startsWith("<html")
        || head.startsWith("<!doctype")
        || head.startsWith("<script")
        || head.contains("<script")) {
      return true;
    }
    if (raw[0] == 'M' && raw[1] == 'Z') {
      return true;
    }
    return raw[0] == 0x7f && raw[1] == 'E' && raw[2] == 'L' && raw[3] == 'F';
  }

  private static boolean jpeg(byte[] raw) {
    return (raw[0] & 0xFF) == 0xFF && (raw[1] & 0xFF) == 0xD8 && (raw[2] & 0xFF) == 0xFF;
  }

  private static boolean png(byte[] raw) {
    return (raw[0] & 0xFF) == 0x89 && raw[1] == 'P' && raw[2] == 'N' && raw[3] == 'G';
  }

  private static boolean gif(byte[] raw) {
    return raw[0] == 'G' && raw[1] == 'I' && raw[2] == 'F';
  }

  private static boolean webp(byte[] raw) {
    return raw[0] == 'R'
        && raw[1] == 'I'
        && raw[2] == 'F'
        && raw[3] == 'F'
        && raw.length > 12
        && raw[8] == 'W'
        && raw[9] == 'E';
  }

  private static BufferedImage read(byte[] raw) {
    try {
      return ImageIO.read(new ByteArrayInputStream(raw));
    } catch (IOException ex) {
      return null;
    }
  }
}
