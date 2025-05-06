package com.springboot.MyTodoList.Test;

import com.springboot.MyTodoList.controller.DeveloperController;
import com.springboot.MyTodoList.service.DeveloperService;
import com.springboot.MyTodoList.model.Developer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

public class DeveloperControllerTest {

    @InjectMocks
    private DeveloperController developerController;

    @Mock
    private DeveloperService developerService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(developerController).build();
    }

    @Test
    public void testGetAllDevelopers() throws Exception {
        // Preparar datos simulados
        Developer dev1 = new Developer(1, "Juan", "Pérez", "Gómez", null, true, "3314639647", "contrasenaSegura3");
        Developer dev2 = new Developer(2, "Maria", "López", "Ramírez", null, false, "3314639648", "contrasenaSegura4");
        List<Developer> developers = Arrays.asList(dev1, dev2);

        // Simular la respuesta del servicio
        when(developerService.findAll()).thenReturn(developers);

        // Ejecutar la solicitud GET y verificar la respuesta
        mockMvc.perform(get("/developers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Juan"))
                .andExpect(jsonPath("$[0].apellidoPaterno").value("Pérez"))
                .andExpect(jsonPath("$[0].telefono").value("3314639647"))
                .andExpect(jsonPath("$[1].nombre").value("Maria"))
                .andExpect(jsonPath("$[1].apellidoPaterno").value("López"))
                .andExpect(jsonPath("$[1].telefono").value("3314639648"));
    }
}