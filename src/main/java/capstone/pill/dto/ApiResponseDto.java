package capstone.pill.dto;

import lombok.Data;

import java.util.ArrayList;

@Data
public class ApiResponseDto<T> {

    private String status;
    private T resBody;



}
