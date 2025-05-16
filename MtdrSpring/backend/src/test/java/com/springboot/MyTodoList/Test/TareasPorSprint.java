package com.springboot.MyTodoList.Test;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.service.*;
import com.springboot.MyTodoList.util.BotLabels;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.Mockito.*;

public class TareasPorSprint {

    @Mock
    private TareaService tareaService;
    @Mock
    private EstadoService estadoService;
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
                null, tareaService, estadoService, null, tareaDeveloperService, sprintService
        );
        // Simular sesión activa y developer logueado
        Developer dev = new Developer();
        dev.setIdDeveloper(1);
        dev.setNombre("TestDev");
        botController.getUserSessions().put(1L, true);
        botController.getDeveloperSessions().put(1L, dev);
    }

    @Test
    void testVerTareasCompletadasUltimoSprint() throws Exception {
        long chatId = 1L;

        // Simular sprints con fechas válidas
        Sprint sprint1 = new Sprint();
        sprint1.setIdSprint(1);
        sprint1.setFechaInicio(LocalDate.of(2024, 1, 1));

        Sprint sprint2 = new Sprint();
        sprint2.setIdSprint(2); // último sprint
        sprint2.setFechaInicio(LocalDate.of(2024, 2, 1));

        when(sprintService.findAll()).thenReturn(Arrays.asList(sprint1, sprint2));

        // Simular tareas
        Tarea tarea1 = new Tarea();
        tarea1.setIdTarea(101);
        tarea1.setNombreTarea("Tarea vieja");
        tarea1.setSprint(sprint1);

        Tarea tarea2 = new Tarea();
        tarea2.setIdTarea(102);
        tarea2.setNombreTarea("Tarea completada");
        tarea2.setSprint(sprint2);

        when(tareaService.findAll()).thenReturn(Arrays.asList(tarea1, tarea2));

        // Simular estado de las tareas
        Estado estadoCompletada = new Estado();
        estadoCompletada.setEstado("Completada");
        when(estadoService.getEstadoById(102)).thenReturn(ResponseEntity.ok(estadoCompletada));
        when(estadoService.getEstadoById(101)).thenReturn(ResponseEntity.ok(new Estado())); // No completada

        // Simular relación tarea-developer
        Developer dev = new Developer();
        dev.setNombre("Juan");
        TareaDeveloper td = new TareaDeveloper();
        td.setDeveloper(dev);
        when(tareaDeveloperService.findByTareaId(102)).thenReturn(Collections.singletonList(td));

        // Simular mensaje de Telegram
        Update update = mock(Update.class);
        Message message = mock(Message.class);
        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);
        when(message.hasText()).thenReturn(true);
        when(message.getText()).thenReturn(BotLabels.LIST_COMPLETED_TASKS.getLabel());
        when(message.getChatId()).thenReturn(chatId);

        // Espiar el método execute para verificar el mensaje enviado
        ToDoItemBotController spyBot = Mockito.spy(botController);
        doReturn(null).when(spyBot).execute(any(org.telegram.telegrambots.meta.api.methods.send.SendMessage.class));

        spyBot.onUpdateReceived(update);

        // Verifica que el mensaje contiene la tarea completada y el nombre del developer
        ArgumentCaptor<org.telegram.telegrambots.meta.api.methods.send.SendMessage> captor =
                ArgumentCaptor.forClass(org.telegram.telegrambots.meta.api.methods.send.SendMessage.class);
        verify(spyBot, times(1)).execute(captor.capture());

        String textoMensaje = captor.getValue().getText();
        System.out.println("Mensaje enviado: " + textoMensaje);
        assert(textoMensaje.contains("Tarea completada"));
        assert(textoMensaje.contains("Juan"));
        assert(textoMensaje.contains("Tareas completadas en el último sprint"));
    }
}