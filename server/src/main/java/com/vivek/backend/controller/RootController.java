package com.vivek.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
@RestController
public class RootController {
    @GetMapping("/")
    public Map<String,Object> root() {
        return Map.of("message","VIVEK backend is running","demo","Beyond Marks");
    }
}
