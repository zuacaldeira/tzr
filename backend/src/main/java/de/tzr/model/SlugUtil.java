package de.tzr.model;

public final class SlugUtil {

    private SlugUtil() {}

    public static String slugify(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String result = input;

        // Replace German umlauts and special characters before lowercasing
        result = result.replace("\u00dc", "Ue").replace("\u00d6", "Oe").replace("\u00c4", "Ae");
        result = result.toLowerCase();
        result = result.replace("\u00fc", "ue").replace("\u00f6", "oe").replace("\u00e4", "ae").replace("\u00df", "ss");

        // Replace non-alphanumeric with hyphens
        result = result.replaceAll("[^a-z0-9]", "-");
        // Collapse multiple hyphens
        result = result.replaceAll("-+", "-");
        // Trim hyphens from ends
        result = result.replaceAll("^-|-$", "");

        return result;
    }
}
