package com.vivek.backend.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vivek.backend.service.VivekService;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VivekController {
    private final VivekService service;
    public VivekController(VivekService service) { this.service = service; }

    @GetMapping("/health")
    public ObjectNode health() { return service.health(); }

    @PostMapping("/questions/generate")
    public ObjectNode generateQuestions(@RequestBody(required=false) JsonNode body) {
        String level = body != null && body.has("level") ? body.path("level").asText("12-15") : "12-15";
        int count = body != null && body.has("count") ? body.path("count").asInt(12) : 12;
        return service.generateQuestions(level, count);
    }

    @PostMapping("/reports")
    public ObjectNode saveReport(@RequestBody(required=false) JsonNode body) {
        return service.saveReport(body == null ? JsonNodeFactory.instance.objectNode() : body);
    }

    @GetMapping("/reports")
    public ObjectNode getReports() { return service.getReports(); }
}
