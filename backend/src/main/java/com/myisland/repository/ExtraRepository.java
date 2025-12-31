package com.myisland.repository;

import com.myisland.model.Extra;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class ExtraRepository {
    private final Map<String, Extra> extras = new ConcurrentHashMap<>();

    public Optional<Extra> findById(String id) {
        return Optional.ofNullable(extras.get(id));
    }

    public Collection<Extra> findAll() {
        return extras.values();
    }

    public List<Extra> findByIds(List<String> ids) {
        return ids.stream()
                .map(extras::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Extra save(Extra extra) {
        extras.put(extra.id(), extra);
        return extra;
    }
}
