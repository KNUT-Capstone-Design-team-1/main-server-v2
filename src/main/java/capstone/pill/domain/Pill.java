package capstone.pill.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pill_id")
    private Long id;

    private String drugDiscrimination;      // 약 식별문자
    private String drugType;                // 약 제형
    private String drugShape;               // 약 조건 모양
    private String drugColor;               // 약 조건 색상
    private String drugLine;                // 약 조건 분할선
    private String drugImage;               // 약 이미 url
    private String drugName;                // 약 이름
    private String drugEffect;              // 효능, 효과
    private String drugDosage;              // 용법, 용량
    @Lob
    private String drugCaution;            // 주의사항
    private String drugTake;                // 복약정보
    private String drugMaker;               // 제조, 수입사

    @Builder
    public Pill(String drugDiscrimination, String drugType, String drugShape, String drugColor, String drugLine, String drugImage, String drugName, String drugEffect, String drugDosage, String drugCaution, String drugTake, String drugMaker) {
        this.drugDiscrimination = drugDiscrimination;
        this.drugType = drugType;
        this.drugShape = drugShape;
        this.drugColor = drugColor;
        this.drugLine = drugLine;
        this.drugImage = drugImage;
        this.drugName = drugName;
        this.drugEffect = drugEffect;
        this.drugDosage = drugDosage;
        this.drugCaution = drugCaution;
        this.drugTake = drugTake;
        this.drugMaker = drugMaker;
    }
}
