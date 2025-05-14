package com.springboot.MyTodoList.controller;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.Developer;
import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.TareaDeveloper;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.DeveloperService;
import com.springboot.MyTodoList.service.EstadoService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TareaDeveloperService;
import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

import java.util.HashMap;
import java.util.Map;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private ToDoItemService toDoItemService;
	private String botName;

	// ------------------------------------
	private TareaService tareaService;
	private EstadoService estadoService;
	private TareaDeveloperService tareaDeveloperService;
	private SprintService sprintService;

	private Map<Long, TaskCreationState> pendingTaskCreations = new HashMap<>();
	private Map<Long, Integer> pendingCompletionTasks = new HashMap<>();
	// Agrega estos atributos arriba en la clase:
	private DeveloperService developerService;
	private Map<Long, Boolean> userSessions = new HashMap<>();

	// Solo para pruebas
public Map<Long, Boolean> getUserSessions() {
    return userSessions;
}

public Map<Long, Developer> getDeveloperSessions() {
    return developerSessions;
}

public Map<Long, TaskCreationState> getPendingTaskCreations() {
    return pendingTaskCreations;
}
	// --------------------

	// Definimos una clase interna para manejar el estado de creación de tareas
	 public static class TaskCreationState {
		private int step; // 1: esperando nombre, 2: esperando horas estimadas
		private String taskName;
		private Double hoursEstimated;

		public int getStep() {
			return step;
		}

		public void setStep(int step) {
			this.step = step;
		}

		public String getTaskName() {
			return taskName;
		}

		public void setTaskName(String taskName) {
			this.taskName = taskName;
		}

		public Double getHoursEstimated() {
			return hoursEstimated;
		}

		public void setHoursEstimated(Double hoursEstimated) {
			this.hoursEstimated = hoursEstimated;
		}

	}

	private Map<Long, Developer> developerSessions = new HashMap<>();

	public ToDoItemBotController(
			String botToken,
			String botName,
			ToDoItemService toDoItemService,
			TareaService tareaService,
			EstadoService estadoService,
			DeveloperService developerService,
			TareaDeveloperService tareaDeveloperService,
			SprintService sprintService) {
		super(botToken);
		this.toDoItemService = toDoItemService;
		this.tareaService = tareaService;
		this.estadoService = estadoService;
		this.botName = botName;
		this.developerService = developerService;
		this.tareaDeveloperService = tareaDeveloperService;
		this.sprintService = sprintService;
	}

	@Override
	public void onUpdateReceived(Update update) {

		if (update.hasMessage() && update.getMessage().hasText()) {

			String messageTextFromTelegram = update.getMessage().getText();
			long chatId = update.getMessage().getChatId();

			// LOGIN
			if (messageTextFromTelegram.startsWith("/login")) {
				String[] parts = messageTextFromTelegram.split(" ");
				if (parts.length != 3) {
					BotHelper.sendMessageToTelegram(chatId, "Usa: /login <telefono> <contrasena>", this);
					return;
				}

				String telefono = parts[1];
				String contrasena = parts[2];

				try {
					Developer dev = developerService.findByTelefonoAndContrasena(telefono, contrasena);
					if (dev != null) {
						userSessions.put(chatId, true);
						developerSessions.put(chatId, dev);
						BotHelper.sendMessageToTelegram(chatId,
								"¡Login exitoso! Ya puedes usar el bot. Bienvenido " + dev.getNombre(), this);
					} else {
						BotHelper.sendMessageToTelegram(chatId, "Credenciales incorrectas.", this);
					}
				} catch (Exception e) {
					logger.error("Error al procesar el login", e);
					BotHelper.sendMessageToTelegram(chatId, "Error al procesar el login. Intenta nuevamente.", this);
				}
				return;
			}

			// VALIDAR SESIÓN ANTES DE PERMITIR CUALQUIER OTRO COMANDO
			if (!userSessions.getOrDefault(chatId, false)) {
				BotHelper.sendMessageToTelegram(chatId, "Debes iniciar sesión con /login <telefono> <contrasena>",
						this);
				return;
			}

			if (pendingCompletionTasks.containsKey(chatId)) {
				try {
					double horasReales = Double.parseDouble(messageTextFromTelegram);
					int taskId = pendingCompletionTasks.get(chatId);

					// Obtener la tarea a través del servicio
					ResponseEntity<Tarea> tareaResponse = tareaService.getTareaById(taskId);
					if (tareaResponse.getStatusCode() == HttpStatus.OK) {
						Tarea tarea = tareaResponse.getBody();
						// Actualizar las horas reales
						tarea.setHorasReales(horasReales);
						tareaService.updateTarea(taskId, tarea);

						// Actualizar el estado a "Completada"
						ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(taskId);
						if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
							Estado estado = estadoResponse.getBody();
							estado.setEstado("Completada");
							estadoService.updateEstado(taskId, estado);
						}

						BotHelper.sendMessageToTelegram(chatId,
								"Tarea " + taskId + " completada con " + horasReales + " horas reales.", this);
					} else {
						BotHelper.sendMessageToTelegram(chatId, "No se encontró la tarea con id " + taskId, this);
					}
				} catch (NumberFormatException e) {
					BotHelper.sendMessageToTelegram(chatId,
							"Por favor, ingresa un número válido para las horas reales.", this);
				}
				pendingCompletionTasks.remove(chatId);
				return;
			}

			if ((messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand()) ||
					messageTextFromTelegram.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel()))
					&& developerSessions.get(chatId) != null) {
				{

					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

					ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
					List<KeyboardRow> keyboard = new ArrayList<>();

					// first row
					KeyboardRow row = new KeyboardRow();
					row.add(BotLabels.INICIAR_TAREA.getLabel());
					row.add(BotLabels.LIST_COMPLETED_TASKS.getLabel());
					// Add the first row to the keyboard
					keyboard.add(row);

					// second row
					row = new KeyboardRow();
					row.add(BotLabels.LIST_ALL_TAREAS.getLabel());
					row.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					row.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
					row.add(BotLabels.COMPLETE_TASK.getLabel());
					row.add(BotLabels.AGREGAR_TAREA.getLabel());
					keyboard.add(row);

					// Set the keyboard
					keyboardMarkup.setKeyboard(keyboard);

					// Add the keyboard markup
					messageToTelegram.setReplyMarkup(keyboardMarkup);

					try {
						execute(messageToTelegram);
					} catch (TelegramApiException e) {
						logger.error(e.getLocalizedMessage(), e);
					}
				}

			} else if (messageTextFromTelegram.equals(BotLabels.COMPLETE_TASK.getLabel())) {
				// Obtener la lista de todas las tareas
				List<Tarea> todasTareas = getAllTareas();
				List<Tarea> tareasFiltradas = new ArrayList<>();

				// Filtrar solo las tareas cuyo estado sea Pendiente o En progreso
				for (Tarea tarea : todasTareas) {
					ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(tarea.getIdTarea());
					if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						String estado = estadoResponse.getBody().getEstado();
						if (estado.equals("Pendiente") || estado.equals("En progreso")) {
							tareasFiltradas.add(tarea);
						}
					}
				}

				if (tareasFiltradas.isEmpty()) {
					BotHelper.sendMessageToTelegram(chatId, "No hay tareas disponibles para completar.", this);
				} else {
					ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
					List<KeyboardRow> keyboard = new ArrayList<>();

					// Para cada tarea filtrada se crea una fila con 2 botones:
					// 1. Información de la tarea: [ID] Nombre de la tarea.
					// 2. Botón para completar la tarea: ID-DASH-Completar Tarea.
					for (Tarea tarea : tareasFiltradas) {
						KeyboardRow row = new KeyboardRow();
						String infoButton = "[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea();
						String completeButton = tarea.getIdTarea() + BotLabels.DASH.getLabel()
								+ BotLabels.COMPLETE_TASK.getLabel();
						row.add(infoButton);
						row.add(completeButton);
						keyboard.add(row);
					}

					// Botón para volver a la pantalla principal
					KeyboardRow mainScreenRow = new KeyboardRow();
					mainScreenRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRow);

					keyboardMarkup.setKeyboard(keyboard);
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText("Selecciona la tarea a completar:");
					messageToTelegram.setReplyMarkup(keyboardMarkup);
					try {
						execute(messageToTelegram);
					} catch (TelegramApiException e) {
						logger.error(e.getLocalizedMessage(), e);
					}
				}

			} else if (messageTextFromTelegram.contains(BotLabels.COMPLETE_TASK.getLabel())
					&& messageTextFromTelegram.contains(BotLabels.DASH.getLabel())) {
				try {
					int dashIndex = messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel());
					String idStr = messageTextFromTelegram.substring(0, dashIndex);
					int taskId = Integer.parseInt(idStr);
					// Se marca la tarea como pendiente de completar para este chat
					pendingCompletionTasks.put(chatId, taskId);
					// Solicitar al usuario que ingrese las horas reales
					BotHelper.sendMessageToTelegram(chatId,
							"Ingresa el tiempo real en horas para la tarea " + taskId + ":", this);
				} catch (Exception e) {
					logger.error("Error al procesar Complete Task", e);
					BotHelper.sendMessageToTelegram(chatId,
							"Error al procesar la tarea. Por favor, intenta nuevamente.", this);
				}

			}

			/////////////// AGREGAR TAREA//////////////////////////////////////////////////
			else if (messageTextFromTelegram.equals(BotLabels.AGREGAR_TAREA.getLabel())) {
				TaskCreationState state = new TaskCreationState();
				state.setStep(1); // Comenzar pidiendo el nombre de la tarea
				pendingTaskCreations.put(chatId, state);
				BotHelper.sendMessageToTelegram(chatId, "Ingrese el nombre de la tarea:", this);
				return;
			}

			// ...en el paso 2, cuando ya tienes el nombre y las horas estimadas:
			else if (pendingTaskCreations.containsKey(chatId)) {
				TaskCreationState state = pendingTaskCreations.get(chatId);
				if (state.getStep() == 1) {
					state.setTaskName(messageTextFromTelegram);
					state.setStep(2);
					BotHelper.sendMessageToTelegram(chatId, "Ingrese las horas estimadas (máximo 4 horas):", this);
					return;
				} else if (state.getStep() == 2) {
					try {
						double horas = Double.parseDouble(messageTextFromTelegram);
						if (horas > 4) {
							BotHelper.sendMessageToTelegram(chatId,
									"El máximo permitido es 4 horas. Por favor, ingrese un valor válido:", this);
							return;
						}
						state.setHoursEstimated(horas);

						// Obtener el developer logueado
						Developer dev = developerSessions.get(chatId);
						if (dev == null) {
							BotHelper.sendMessageToTelegram(chatId, "Debes iniciar sesión primero.", this);
							pendingTaskCreations.remove(chatId);
							return;
						}

						// Obtener el último sprint
						List<Sprint> sprints = sprintService.findAll();
						if (sprints.isEmpty()) {
							BotHelper.sendMessageToTelegram(chatId, "No hay sprints registrados.", this);
							pendingTaskCreations.remove(chatId);
							return;
						}
						int ultimoSprintId = sprints.stream()
								.mapToInt(Sprint::getIdSprint)
								.max()
								.getAsInt();
						Sprint ultimoSprint = sprints.stream()
								.filter(s -> s.getIdSprint() == ultimoSprintId)
								.findFirst()
								.orElse(null);

						// Crear la tarea
						Tarea newTarea = new Tarea();
						newTarea.setNombreTarea(state.getTaskName());
						newTarea.setFechaRegistro(java.time.LocalDate.now());
						newTarea.setFechaFin(java.time.LocalDate.now().plusDays(2));
						newTarea.setHorasEstimadas(horas);
						newTarea.setHorasReales(null);
						newTarea.setSprint(ultimoSprint);

						// Guardar la tarea
						Tarea tareaGuardada = tareaService.addTarea(newTarea);

						// Asociar la tarea al developer usando el constructor completo
						TareaDeveloper nuevaAsociacion = new TareaDeveloper(tareaGuardada, dev);
						tareaDeveloperService.addTareaDeveloper(nuevaAsociacion);

						BotHelper.sendMessageToTelegram(chatId,
								"Tarea agregada correctamente al último sprint y asignada a ti.", this);
					} catch (NumberFormatException e) {
						BotHelper.sendMessageToTelegram(chatId,
								"Por favor, ingrese un número válido para las horas estimadas:", this);
						return;
					}
					pendingTaskCreations.remove(chatId);
					return;
				}
			}

			///////// INICIAR TAREA ///////////////////////////////////////////////////////

			///////////////////////////////////////////
			// Bloque para procesar la acción de iniciar una tarea
			else if (messageTextFromTelegram.contains(BotLabels.INICIAR_TAREA.getLabel())
					&& messageTextFromTelegram.contains(BotLabels.DASH.getLabel())) {
				try {
					int dashIndex = messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel());
					String idStr = messageTextFromTelegram.substring(0, dashIndex);
					int taskId = Integer.parseInt(idStr);

					// Obtener el estado de la tarea
					ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(taskId);
					if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						Estado estado = estadoResponse.getBody();
						if (estado.getEstado().equals("Pendiente")) {
							// Actualizar el estado a "En progreso"
							estado.setEstado("En progreso");
							estadoService.updateEstado(taskId, estado);
							BotHelper.sendMessageToTelegram(chatId,
									"Tarea " + taskId + " iniciada y ahora en progreso.", this);
						} else {
							BotHelper.sendMessageToTelegram(chatId,
									"La tarea " + taskId + " no se encuentra en estado Pendiente.", this);
						}
					} else {
						BotHelper.sendMessageToTelegram(chatId, "No se encontró la tarea con id " + taskId, this);
					}
				} catch (Exception e) {
					logger.error("Error al procesar Iniciar Tarea", e);
					BotHelper.sendMessageToTelegram(chatId,
							"Error al procesar la tarea. Por favor, intenta nuevamente.", this);
				}

			} 
			
			// ...existing code...

			//// VER TODAS MIS TAREAS DEL ULTIMO SPRINT/////
			else if (messageTextFromTelegram.equals(BotLabels.LIST_ALL_TAREAS.getLabel())) {
				Developer dev = developerSessions.get(chatId);
				if (dev == null) {
					BotHelper.sendMessageToTelegram(chatId, "Debes iniciar sesión primero.", this);
					return;
				}

				int developerId = dev.getIdDeveloper();
				List<Tarea> tareas = tareaDeveloperService.findTareasByDeveloperId(developerId);

				// Obtener el último sprint (mayor idSprint)
				List<Sprint> sprints = sprintService.findAll();
				if (sprints.isEmpty()) {
					BotHelper.sendMessageToTelegram(chatId, "No hay sprints registrados.", this);
					return;
				}
				int ultimoSprintId = sprints.stream()
						.mapToInt(Sprint::getIdSprint)
						.max()
						.getAsInt();

				// Crear el teclado con una fila por tarea
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				for (Tarea tarea : tareas) {
					if (tarea.getSprint() != null && tarea.getSprint().getIdSprint() == ultimoSprintId) {
						KeyboardRow row = new KeyboardRow();
						row.add("[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea());
						keyboard.add(row);
					}
				}

				// Botón para regresar al menú principal
				KeyboardRow mainMenuRow = new KeyboardRow();
				mainMenuRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainMenuRow);

				keyboardMarkup.setKeyboard(keyboard);

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				// borrar aqui developer id
				messageToTelegram.setText("Tus tareas del último sprint: " + developerId);
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			}

			////////////TAREAS COMPLETADAS POR SPRINT Y QUIER LAS COMPLETO//////

else if (messageTextFromTelegram.equals(BotLabels.LIST_COMPLETED_TASKS.getLabel())) {
    // Obtener el último sprint
    List<Sprint> sprints = sprintService.findAll();
    if (sprints.isEmpty()) {
        BotHelper.sendMessageToTelegram(chatId, "No hay sprints registrados.", this);
        return;
    }
    int ultimoSprintId = sprints.stream()
            .mapToInt(Sprint::getIdSprint)
            .max()
            .getAsInt();

    // Obtener todas las tareas del último sprint
    List<Tarea> todasTareas = tareaService.findAll();
    StringBuilder sb = new StringBuilder();
    sb.append("*Tareas completadas en el último sprint:*\n\n");

    boolean hayCompletadas = false;
    for (Tarea tarea : todasTareas) {
        if (tarea.getSprint() != null && tarea.getSprint().getIdSprint() == ultimoSprintId) {
            // Verifica si la tarea está completada
            Estado estado = estadoService.getEstadoById(tarea.getIdTarea()).getBody();
            if (estado != null && "Completada".equalsIgnoreCase(estado.getEstado())) {
                // Busca el developer que la completó
                List<TareaDeveloper> relaciones = tareaDeveloperService.findByTareaId(tarea.getIdTarea());
                String nombreDev = "Desconocido";
                if (relaciones != null && !relaciones.isEmpty() && relaciones.get(0).getDeveloper() != null) {
                    nombreDev = relaciones.get(0).getDeveloper().getNombre();
                }
                // Usar formato Markdown para simular recuadro
                sb.append("🟩 *Tarea:* `").append(tarea.getNombreTarea()).append("`\n")
                  .append("👤 *Completada por:* ").append(nombreDev).append("\n\n");
                hayCompletadas = true;
            }
        }
    }
    if (!hayCompletadas) {
        sb.append("_No hay tareas completadas en este sprint._");
    }

    // Crear teclado con botón para regresar al menú principal
    ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
    List<KeyboardRow> keyboard = new ArrayList<>();
    KeyboardRow mainMenuRow = new KeyboardRow();
    mainMenuRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
    keyboard.add(mainMenuRow);
    keyboardMarkup.setKeyboard(keyboard);

    SendMessage messageToTelegram = new SendMessage();
    messageToTelegram.setChatId(chatId);
    messageToTelegram.setText(sb.toString());
    messageToTelegram.setReplyMarkup(keyboardMarkup);
    messageToTelegram.setParseMode("Markdown");

    try {
        execute(messageToTelegram);
    } catch (TelegramApiException e) {
        logger.error(e.getLocalizedMessage(), e);
    }
    return;
}

// ...existing code...
			/////////////////////////////////////////////////


		}
	}

	@Override
	public String getBotUsername() {
		return botName;
	}

	
	public List<Tarea> getAllTareas() {
		return tareaService.findAll();
	}


}