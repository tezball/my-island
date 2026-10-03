package island.catalog.api;

import island.catalog.api.dto.StayResponse;
import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.place.BadRequestException;
import island.catalog.stay.StayJdbc;
import island.catalog.stay.StayNotFoundException;
import island.catalog.stay.StayService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/host/stays")
public class HostStayController {

  private final StayService stays;
  private final StayJdbc jdbc;

  public HostStayController(StayService stays, StayJdbc jdbc) {
    this.stays = stays;
    this.jdbc = jdbc;
  }

  @GetMapping
  List<StayResponse> list(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    return jdbc.listForHost(principal.id());
  }

  @GetMapping("/{id}")
  StayResponse get(
      @AuthenticationPrincipal CatalogUserPrincipal principal, @PathVariable String id) {
    return stays.requireHost(principal.id(), uuid(id));
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  ResponseEntity<StayResponse> create(
      @AuthenticationPrincipal CatalogUserPrincipal principal,
      @RequestParam String kind,
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) String cost,
      @RequestParam(required = false) String phone,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String website,
      @RequestParam String latitude,
      @RequestParam String longitude,
      @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    StayResponse created =
        stays.create(
            principal.id(),
            new StayService.StayWrite(
                kind,
                title,
                description,
                cost,
                phone,
                email,
                website,
                latitude,
                longitude,
                bytes(images),
                false));
    return ResponseEntity.created(java.net.URI.create("/api/v1/host/stays/" + created.id()))
        .body(created);
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  StayResponse update(
      @AuthenticationPrincipal CatalogUserPrincipal principal,
      @PathVariable String id,
      @RequestParam String kind,
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) String cost,
      @RequestParam(required = false) String phone,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String website,
      @RequestParam String latitude,
      @RequestParam String longitude,
      @RequestParam(defaultValue = "false") boolean keepImages,
      @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    return stays.update(
        principal.id(),
        uuid(id),
        new StayService.StayWrite(
            kind,
            title,
            description,
            cost,
            phone,
            email,
            website,
            latitude,
            longitude,
            bytes(images),
            keepImages));
  }

  @GetMapping("/{id}/images/{position}")
  ResponseEntity<byte[]> image(
      @AuthenticationPrincipal CatalogUserPrincipal principal,
      @PathVariable String id,
      @PathVariable int position) {
    stays.requireHost(principal.id(), uuid(id));
    return jpeg(uuid(id), position);
  }

  private ResponseEntity<byte[]> jpeg(UUID stayId, int position) {
    StayJdbc.StoredImage image =
        jdbc.image(stayId, position).filter(row -> row.width() > 0).orElseThrow(StayNotFoundException::new);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
        .body(image.bytes());
  }

  private static UUID uuid(String raw) {
    try {
      return UUID.fromString(raw);
    } catch (IllegalArgumentException ex) {
      throw new StayNotFoundException();
    }
  }

  private static List<byte[]> bytes(List<MultipartFile> files) {
    if (files == null) {
      return List.of();
    }
    List<byte[]> out = new ArrayList<>();
    for (MultipartFile file : files) {
      if (file == null || file.isEmpty()) {
        continue;
      }
      try {
        out.add(file.getBytes());
      } catch (IOException ex) {
        throw new BadRequestException("Could not read a photo");
      }
    }
    return out;
  }
}
