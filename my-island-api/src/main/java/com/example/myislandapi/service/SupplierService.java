package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.UpdateSupplierProfileRequest;
import com.example.myislandapi.dto.response.SupplierProfileResponse;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.SupplierModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcSupplierRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SupplierService {

    private final JdbcSupplierRepository supplierRepository;
    private final JdbcUserRepository userRepository;

    public SupplierService(JdbcSupplierRepository supplierRepository, JdbcUserRepository userRepository) {
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public SupplierProfileResponse getProfile(UUID userId) {
        SupplierModel supplier = supplierRepository.findByUserId(userId)
                .orElseGet(() -> createSupplierProfile(userId));
        return SupplierProfileResponse.from(supplier);
    }

    @Transactional
    public SupplierProfileResponse updateProfile(UUID userId, UpdateSupplierProfileRequest request) {
        SupplierModel supplier = supplierRepository.findByUserId(userId)
                .orElseGet(() -> createSupplierProfile(userId));

        if (request.businessName() != null) {
            supplier.setBusinessName(request.businessName());
        }
        if (request.description() != null) {
            supplier.setDescription(request.description());
        }
        if (request.location() != null) {
            supplier.setLocation(request.location());
        }
        if (request.contactEmail() != null) {
            supplier.setContactEmail(request.contactEmail());
        }
        if (request.phoneNumber() != null) {
            supplier.setPhoneNumber(request.phoneNumber());
        }
        if (request.category() != null) {
            supplier.setCategory(request.category());
        }
        if (request.eircode() != null) {
            supplier.setEircode(request.eircode());
        }
        if (request.latitude() != null) {
            supplier.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            supplier.setLongitude(request.longitude());
        }

        supplier = supplierRepository.save(supplier);
        return SupplierProfileResponse.from(supplier);
    }

    @Transactional
    public SupplierProfileResponse updateLogoUrl(UUID userId, String logoUrl) {
        SupplierModel supplier = supplierRepository.findByUserId(userId)
                .orElseGet(() -> createSupplierProfile(userId));

        supplier.setLogoUrl(logoUrl);
        supplier = supplierRepository.save(supplier);
        return SupplierProfileResponse.from(supplier);
    }

    private SupplierModel createSupplierProfile(UUID userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        SupplierModel supplier = new SupplierModel();
        supplier.setUserId(userId);
        supplier.setContactEmail(user.getEmail());
        supplier.setPhoneNumber(user.getPhone());
        return supplierRepository.save(supplier);
    }
}
