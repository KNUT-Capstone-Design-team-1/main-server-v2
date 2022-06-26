package capstone.pill.controller;

import capstone.pill.dto.ApiRequestDto;
import capstone.pill.dto.ApiResponseDto;
import capstone.pill.service.RestService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    private final RestService restService;


    // 테스트용 메서드(인공지능 서버에 전송하지 않고 크롤링한다)
    @PostMapping("/search")
    public List<ApiResponseDto> response(@RequestBody ApiRequestDto requestDto) throws Exception {
        List<ApiResponseDto> res = restService.res(requestDto);

        return res;
    }

    // 실제로 사용 될 메서드
    @PostMapping("/image")
    public List<ApiResponseDto> search(@RequestBody imageRequestDto imageRequestDto) throws Exception {
        ArrayList<ApiResponseDto> response = restService.toML(imageRequestDto.getImg_base64());

        return response;
    }

    @Data
    static class imageRequestDto{
        private String img_base64;
    }
}
