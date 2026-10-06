package com.vivek.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class VivekService {
    private final ObjectMapper mapper;
    private final RestClient restClient;
    private final Path questionsFile = Path.of("data", "questions.json");
    private final Path reportsFile = Path.of("data", "reports.json");

    public VivekService(ObjectMapper mapper, RestClient.Builder builder) {
        this.mapper = mapper;
        this.restClient = builder.build();
    }

    public ObjectNode health() {
        ObjectNode out = mapper.createObjectNode();
        out.put("ok", true);
        out.put("aiEnabled", hasGeminiKey());
        return out;
    }

    public ObjectNode generateQuestions(String level, int count) {
        if (level == null || level.isBlank()) level = "12-15";
        count = Math.max(1, Math.min(count, 100));

        if (hasGeminiKey()) {
            try {
                JsonNode ai = generateWithGemini(level, count);
                if (ai != null && ai.isArray() && ai.size() > 0) {
                    ArrayNode selected = mapper.createArrayNode();
                    for (int i = 0; i < Math.min(count, ai.size()); i++) selected.add(ai.get(i));
                    ObjectNode out = mapper.createObjectNode();
                    out.put("mode", "ai");
                    out.set("questions", selected);
                    return out;
                }
            } catch (Exception e) {
                System.out.println("Gemini failed; using fallback: " + e.getMessage());
            }
        }

        ArrayNode bank = readQuestions(level);
        List<JsonNode> list = new ArrayList<>();
        bank.forEach(list::add);
        Collections.shuffle(list);

        ArrayNode selected = mapper.createArrayNode();
        for (int i = 0; i < Math.min(count, list.size()); i++) selected.add(list.get(i));

        ObjectNode out = mapper.createObjectNode();
        out.put("mode", "fallback");
        out.set("questions", selected);
        return out;
    }

    private ArrayNode readQuestions(String level) {
        try {
            if (!Files.exists(questionsFile)) return mapper.createArrayNode();
            JsonNode root = mapper.readTree(Files.readString(questionsFile));
            JsonNode selected = root.path(level);
            if (!selected.isArray()) selected = root.path("12-15");
            return selected.isArray() ? (ArrayNode) selected : mapper.createArrayNode();
        } catch (IOException e) {
            throw new RuntimeException("Could not read question bank.", e);
        }
    }

    private boolean hasGeminiKey() {
        String key = System.getenv("GEMINI_API_KEY");
        return key != null && !key.isBlank();
    }

    private JsonNode generateWithGemini(String level, int count) throws Exception {
        String key = System.getenv("GEMINI_API_KEY");
        String prompt = """
Generate %d age-appropriate multiple-choice questions for learner group %s.
This is an educational assessment inspired by concentration, self-reliance, perseverance and initiative.
Do NOT make psychological or IQ claims. Questions must be normal academic/reasoning MCQs.
Return ONLY valid JSON array. Each item:
{
 "id":"ai-1",
 "question":"...",
 "options":["...","...","...","..."],
 "correctAnswer":"A",
 "explanation":"...",
 "difficulty":"Easy|Medium|Hard",
 "subject":"...",
 "ageGroup":"%s",
 "hint":"A thinking hint that does not reveal the answer."
}
Use exactly 4 options.
""".formatted(count, level, level);

        Map<String,Object> body = Map.of(
            "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        JsonNode data = restClient.post()
            .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}", key)
            .body(body)
            .retrieve()
            .body(JsonNode.class);

        String text = data == null ? "" :
            data.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");

        return mapper.readTree(text.replace("```json", "").replace("```", "").trim());
    }

    public ObjectNode saveReport(JsonNode report) {
        try {
            ArrayNode reports = readReports();
            ObjectNode saved = mapper.createObjectNode();

            saved.put("id", "VIVEK-" + System.currentTimeMillis());
            String createdAt = report.path("createdAt").asText("");
            saved.put("createdAt", createdAt.isBlank() ? Instant.now().toString() : createdAt);

            copy(report, saved, "level");
            copy(report, saved, "wellbeing");
            copy(report, saved, "interactions");
            copy(report, saved, "reflection");
            copy(report, saved, "result");

            reports.insert(0, saved);
            ArrayNode limited = mapper.createArrayNode();
            for (int i = 0; i < Math.min(100, reports.size()); i++) limited.add(reports.get(i));
            writeReports(limited);

            ObjectNode out = mapper.createObjectNode();
            out.put("ok", true);
            out.set("report", saved);
            return out;
        } catch (IOException e) {
            throw new RuntimeException("Could not save report.", e);
        }
    }

    public ObjectNode getReports() {
        ObjectNode out = mapper.createObjectNode();
        out.set("reports", readReports());
        return out;
    }

    private void copy(JsonNode source, ObjectNode target, String field) {
        JsonNode value = source.get(field);
        if (value != null && !value.isNull()) target.set(field, value);
        else if ("interactions".equals(field)) target.set(field, mapper.createArrayNode());
        else target.set(field, mapper.createObjectNode());
    }

    private ArrayNode readReports() {
        try {
            if (!Files.exists(reportsFile)) {
                Files.createDirectories(reportsFile.getParent());
                Files.writeString(reportsFile, "[]", StandardOpenOption.CREATE);
            }
            JsonNode root = mapper.readTree(Files.readString(reportsFile));
            return root != null && root.isArray() ? (ArrayNode) root : mapper.createArrayNode();
        } catch (IOException e) {
            throw new RuntimeException("Could not read reports.", e);
        }
    }

    private void writeReports(ArrayNode reports) throws IOException {
        Files.createDirectories(reportsFile.getParent());
        mapper.writerWithDefaultPrettyPrinter().writeValue(reportsFile.toFile(), reports);
    }
}
