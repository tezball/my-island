package com.example.myislandapi.repository;

import com.example.myislandapi.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, UUID> {

    List<FAQ> findByActiveTrueOrderBySortOrderAsc();

    List<FAQ> findByActiveTrueAndCategoryOrderBySortOrderAsc(String category);
}
