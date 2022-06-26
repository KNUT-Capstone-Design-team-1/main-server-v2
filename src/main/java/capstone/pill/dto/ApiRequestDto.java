package capstone.pill.dto;

import lombok.Data;

@Data
public class ApiRequestDto {
    private String drug_name; // 약 식별문자
    private String drug_type; // 약 제형
    private String drug_shape; // 약 조건 모양
    private String drug_color; // 약 조건 색상
    private String drug_line; // 약 조건 분할선
}
