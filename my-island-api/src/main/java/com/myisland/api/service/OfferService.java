package com.myisland.api.service;

import com.myisland.api.dto.response.OfferResponse;
import com.myisland.api.entity.SupplierOffer;
import com.myisland.api.exception.ResourceNotFoundException;
import com.myisland.api.repository.SupplierOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final SupplierOfferRepository offerRepository;

    public List<OfferResponse> getOffers(String category) {
        List<SupplierOffer> offers;

        if (category != null && !category.isEmpty() && !"all".equals(category)) {
            try {
                SupplierOffer.OfferCategory cat = SupplierOffer.OfferCategory.valueOf(category.toUpperCase());
                offers = offerRepository.findByCategory(cat);
            } catch (IllegalArgumentException e) {
                offers = offerRepository.findAll();
            }
        } else {
            offers = offerRepository.findAll();
        }

        return offers.stream()
            .map(OfferResponse::from)
            .toList();
    }

    public OfferResponse getOffer(UUID id) {
        SupplierOffer offer = offerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Offer", id.toString()));

        return OfferResponse.from(offer);
    }
}
