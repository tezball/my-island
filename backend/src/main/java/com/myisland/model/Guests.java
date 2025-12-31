package com.myisland.model;

public record Guests(int adults, int children) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int adults;
        private int children;

        public Builder adults(int adults) {
            this.adults = adults;
            return this;
        }

        public Builder children(int children) {
            this.children = children;
            return this;
        }

        public Guests build() {
            return new Guests(adults, children);
        }
    }
}
