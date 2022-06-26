package capstone.pill.service;

import capstone.pill.dto.ApiRequestDto;
import capstone.pill.dto.ApiResponseDto;
import capstone.pill.dto.ImageRequestDto;
import capstone.pill.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RestService {

    private final PillCrawling pillCrawling;

    // 테스트용 메서드
    @Transactional
    public List<ApiResponseDto> res(ApiRequestDto requestDto) throws Exception {

        if (requestDto.getDrug_name().equals("") || requestDto.getDrug_shape().equals("")){
            throw new CustomException("사진을 인식할 수 없습니다.");
        }
        ApiResponseDto crawlResult = pillCrawling.crawl(requestDto);
        List<ApiResponseDto> result = new ArrayList<>();

        result.add(crawlResult);
        return result;
    }

    // 실제로 사용될 메서드
    // 인공지능 서버에 데이터 전송 -> 전송받은 약의 데이터로 크롤링 및 DB 저장 -> Json 형태로 애플리케이션에 반환
    @Transactional
    public ArrayList<ApiResponseDto> toML(String image_url) throws Exception {

        // 이미지 전송 후 식별문자 리턴 받기
        URI uri = UriComponentsBuilder
                .fromUriString("http://dl:5000")
                .path("/data")
                .encode()
                .build()
                .toUri();

        // 이미지 url Json 형태로 변환
        ImageRequestDto imageRequestDto = new ImageRequestDto();
        imageRequestDto.setImg_base64(image_url);

        // 인공지능 서버로 전송하기 위해 리소스 생성
        RequestEntity<ImageRequestDto> requestDto = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .body(imageRequestDto);

        RestTemplate restTemplate = new RestTemplate();


        log.info("인공지능 서버 접속 시도");
        // 인공지능 서버로 전송
        ResponseEntity<ApiRequestDto> response = restTemplate.exchange(requestDto, ApiRequestDto.class);
        ApiRequestDto responseBody = response.getBody();
        log.info("인공지능 서버 접속 성공");

        if (responseBody.getDrug_name().equals("") || responseBody.getDrug_shape().equals("")){
            throw new CustomException("사진을 인식할 수 없습니다.");
        }

        // 인공지능 서버로 부터 전송받은 데이터를 크롤링
        ApiResponseDto crawl = pillCrawling.crawl(responseBody);
        ArrayList<ApiResponseDto> result = new ArrayList<>();
        result.add(crawl);

        return result;


    }
}
