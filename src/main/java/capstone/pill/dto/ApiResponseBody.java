package capstone.pill.dto;

import lombok.Data;

@Data
public class ApiResponseBody {

    // 약 이미 url
    private String image;
    // 약 이름
    private String name;
    // 효능.효과
    private String effect;
    // 용법,용량
    private String dosage;
    // 주의사항
    private String caution;
    // 복약정보
    private String take;
    // 제조/수입사
    private String maker;
}
