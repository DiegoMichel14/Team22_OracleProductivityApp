package com.springboot.MyTodoList.Test;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.service.*;
import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.util.BotLabels;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CrearTareaTest {

    @Mock
    private TareaService tareaService;
    @Mock
    private TareaDeveloperService tareaDeveloperService;
    @Mock
    private SprintService sprintService;

    @InjectMocks
    private ToDoItemBotController botController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        botController = new ToDoItemBotController(
                "token", "botName",
                null, tareaService, null, null, tareaDeveloperService, sprintService
        );
        // Simular sesión activa y developer logueado
        Developer dev = new Developer();
        dev.setIdDeveloper(1);
        dev.setNombre("TestDev");
        botController.getUserSessions().put(1L, true);
        botController.getDeveloperSessions().put(1L, dev);
    }

    @Test
    public void testCrearTareaSimple() {
        long chatId = 1L;
        String nombreTarea = "Demo tarea";
        double horas = 2.0;

        // Simular sprint
        Sprint sprint = new Sprint();
        sprint.setIdSprint(5);
        when(sprintService.findAll()).thenReturn(Collections.singletonList(sprint));
        when(tareaService.addTarea(any(Tarea.class))).thenReturn(new Tarea());

        // Paso 1: usuario selecciona "Agregar tarea"
        Update updateAgregar = mock(Update.class);
        Message messageAgregar = mock(Message.class);
        when(updateAgregar.hasMessage()).thenReturn(true);
        when(updateAgregar.getMessage()).thenReturn(messageAgregar);
        when(messageAgregar.hasText()).thenReturn(true);
        when(messageAgregar.getText()).thenReturn(BotLabels.AGREGAR_TAREA.getLabel());
        when(messageAgregar.getChatId()).thenReturn(chatId);

        botController.onUpdateReceived(updateAgregar);
        assert(botController.getPendingTaskCreations().containsKey(chatId));

        // Paso 2: usuario ingresa nombre
        Update updateNombre = mock(Update.class);
        Message messageNombre = mock(Message.class);
        when(updateNombre.hasMessage()).thenReturn(true);
        when(updateNombre.getMessage()).thenReturn(messageNombre);
        when(messageNombre.hasText()).thenReturn(true);
        when(messageNombre.getText()).thenReturn(nombreTarea);
        when(messageNombre.getChatId()).thenReturn(chatId);

        botController.onUpdateReceived(updateNombre);
        System.out.println("Paso 2 alcanzado: esperando horas para la tarea '" + nombreTarea + "'");
        assert(botController.getPendingTaskCreations().get(chatId).getStep() == 2);

        // Paso 3: usuario ingresa horas
        Update updateHoras = mock(Update.class);
        Message messageHoras = mock(Message.class);
        when(updateHoras.hasMessage()).thenReturn(true);
        when(updateHoras.getMessage()).thenReturn(messageHoras);
        when(messageHoras.hasText()).thenReturn(true);
        when(messageHoras.getText()).thenReturn(String.valueOf(horas));
        when(messageHoras.getChatId()).thenReturn(chatId);

        botController.onUpdateReceived(updateHoras);

        verify(tareaService, times(1)).addTarea(any(Tarea.class));
        verify(tareaDeveloperService, times(1)).addTareaDeveloper(any(TareaDeveloper.class));
        assert(!botController.getPendingTaskCreations().containsKey(chatId));
        System.out.println("Tarea '" + nombreTarea + "' creada con éxito y asignada al usuario.");
    }
}