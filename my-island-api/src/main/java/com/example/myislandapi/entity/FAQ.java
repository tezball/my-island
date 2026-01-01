package com.example.myislandapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "faqs")
public class FAQ extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String question;

    @NotBlank
    @Column(length = 2000, nullable = false)
    private String answer;

    @Column(nullable = false)
    private String category;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean active = true;

    public FAQ() {}

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
