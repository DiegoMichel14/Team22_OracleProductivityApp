package com.springboot.MyTodoList.Test;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.service.*;
import com.springboot.MyTodoList.util.BotLabels;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TareasUltimoSpintTest {

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
                null, null, null, null, tareaDeveloperService, sprintService
        );
        // Simular sesión activa y developer logueado
        Developer dev = new Developer();
        dev.setIdDeveloper(1);
        dev.setNombre("TestDev");
        botController.getUserSessions().put(1L, true);
        botController.getDeveloperSessions().put(1L, dev);
    }

    @Test
    public void testVerTareasUltimoSprint() throws Exception {
        long chatId = 1L;

        // Simular sprints
        Sprint sprint1 = new Sprint();
        sprint1.setIdSprint(1);
        Sprint sprint2 = new Sprint();
        sprint2.setIdSprint(2); // último sprint

        when(sprintService.findAll()).thenReturn(Arrays.asList(sprint1, sprint2));

        // Simular tareas del developer
        Tarea tarea1 = new Tarea();
        tarea1.setIdTarea(101);
        tarea1.setNombreTarea("Tarea vieja");
        tarea1.setSprint(sprint1);

        Tarea tarea2 = new Tarea();
        tarea2.setIdTarea(102);
        tarea2.setNombreTarea("Tarea actual");
        tarea2.setSprint(sprint2);

        when(tareaDeveloperService.findTareasByDeveloperId(1)).thenReturn(Arrays.asList(tarea1, tarea2));

        // Simular mensaje de Telegram
        Update update = mock(Update.class);
        Message message = mock(Message.class);
        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);
        when(message.hasText()).thenReturn(true);
        when(message.getText()).thenReturn(BotLabels.LIST_ALL_TAREAS.getLabel());
        when(message.getChatId()).thenReturn(chatId);

        // Espiar el método execute para verificar que se envía el mensaje correcto
        ToDoItemBotController spyBot = Mockito.spy(botController);
        doReturn(null).when(spyBot).execute(any(org.telegram.telegrambots.meta.api.methods.send.SendMessage.class));

        spyBot.onUpdateReceived(update);

        // Verifica que solo se muestra la tarea del último sprint
        ArgumentCaptor<org.telegram.telegrambots.meta.api.methods.send.SendMessage> captor =
                ArgumentCaptor.forClass(org.telegram.telegrambots.meta.api.methods.send.SendMessage.class);
        verify(spyBot, times(1)).execute(captor.capture());

        String textoMensaje = captor.getValue().getText();
        System.out.println("Mensaje enviado: " + textoMensaje);
        assert(textoMensaje.contains("Tus tareas del último sprint"));
    }
}