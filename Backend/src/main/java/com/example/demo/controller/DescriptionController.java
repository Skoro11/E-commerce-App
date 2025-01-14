package com.example.demo.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from your frontend's origin
public class DescriptionController {

    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");  // Replace with your actual API key
    private static final String OPENAI_API_URL = System.getenv("OPENAI_API_URL");  // OpenAI chat completions endpoint

    @PostMapping("/enhance-description")
    public Map<String, String> enhanceDescription(@RequestBody Map<String, String> request) {
        String description = request.get("description");

        // Call OpenAI API to enhance the description
        String enhancedDescription = callAIToEnhance(description);

        Map<String, String> response = new HashMap<>();
        response.put("enhancedDescription", enhancedDescription);
        return response;
    }

    private String callAIToEnhance(String description) {
        // Prepare the API payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini"); // Your AI model
        payload.put("store", true);  // Store the response if required
        payload.put("messages", Arrays.asList(
                new HashMap<String, Object>() {{
                    put("role", "user");
                    put("content", "Improve me this description and only show me the description without you saying anything else outside of description, " +
                            "take into consideration that these descriptions are for products that I am trying to sell " + description);  // Custom prompt for enhancement
                }}
        ));

        // Set HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY);

        // Create HTTP request entity
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        // Send POST request to OpenAI API
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    if (choice.containsKey("message")) {
                        Map<String, String> message = (Map<String, String>) choice.get("message");
                        return message.get("content");  // Enhanced description
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error enhancing the description: " + e.getMessage();
        }

        return "Could not enhance the description.";
    }
}
