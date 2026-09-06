from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CATALOG = REPO / "services" / "catalog"
JAVA = CATALOG / "src" / "main" / "java"


def test_catalog_module_exists() -> None:
    assert (CATALOG / "pom.xml").is_file()
    assert (CATALOG / "mvnw").is_file()
    pom = (CATALOG / "pom.xml").read_text()
    assert "3.5.16" in pom
    assert "<java.version>21</java.version>" in pom
    assert "island.catalog" in (CATALOG / "src/main/java/island/catalog/CatalogApplication.java").read_text()


def test_category_and_facilities_are_not_java_enums() -> None:
    text = "\n".join(path.read_text() for path in JAVA.rglob("*.java"))
    assert "enum Category" not in text
    assert "enum Facility" not in text
    assert "enum County" not in text


def test_catalog_has_no_stripe_or_booking_surface() -> None:
    blob = "\n".join(
        path.read_text()
        for path in list(JAVA.rglob("*.java"))
        + list((CATALOG / "src/main/resources").rglob("*"))
        if path.is_file()
    ).lower()
    assert "stripe" not in blob
    assert "fastapi" not in blob
    assert "next.js" not in blob
    for col in ("availability", "inventory", "live_rate"):
        assert col not in blob


def test_ci_has_catalog_job() -> None:
    text = (REPO / ".github/workflows/ci.yml").read_text()
    assert "name: catalog tests" in text
    assert "services/catalog" in text
    assert "./mvnw -B test" in text


def test_flyway_seeds_listing_types_and_ni() -> None:
    category = (CATALOG / "src/main/resources/db/migration/V2__category.sql").read_text()
    for ident in ("poi", "experience", "campsite", "bnb"):
        assert ident in category
    county = (CATALOG / "src/main/resources/db/migration/V4__county.sql").read_text()
    for ident in ("antrim", "armagh", "down", "fermanagh", "derry", "tyrone"):
        assert ident in county
    migrations = list((CATALOG / "src/main/resources/db/migration").glob("V*.sql"))
    assert not any(path.name.startswith("V6__") for path in migrations)


def test_chaos_monkey_is_off_on_default_compose() -> None:
    pom = (CATALOG / "pom.xml").read_text()
    assert "chaos-monkey-spring-boot" in pom
    default_compose = (REPO / "compose.yml").read_text()
    assert "SPRING_PROFILES_ACTIVE: chaos" not in default_compose
    overlay = (REPO / "compose.chaos.yml").read_text()
    assert "SPRING_PROFILES_ACTIVE: chaos,chaos-monkey" in overlay
    assert "profile chaos" in overlay
    assert "--profile chaos" in overlay
    app = (CATALOG / "src/main/resources/application.yml").read_text()
    assert "enabled: false" in app
    assert "group:" in app
    assert "- chaos-monkey" in app
    chaos = (CATALOG / "src/main/resources/application-chaos.yml").read_text()
    assert "enabled: true" in chaos
    assert "kill-application-active: false" in chaos
    dev = (REPO / "scripts/dev").read_text()
    up_block = dev.split("cmd_up()")[1].split("ensure_catalog_db")[0]
    assert "compose.chaos.yml" not in up_block
