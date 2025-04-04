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

import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.EstadoService;
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

	private Map<Long, TaskCreationState> pendingTaskCreations = new HashMap<>();
	private Map<Long, Integer> pendingCompletionTasks = new HashMap<>();
	// --------------------

	// Definimos una clase interna para manejar el estado de creación de tareas
	private static class TaskCreationState {
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

	// public ToDoItemBotController(String botToken, String botName, ToDoItemService toDoItemService) {
	// 	super(botToken);
	// 	logger.info("Bot Token: " + botToken);
	// 	logger.info("Bot name: " + botName);
	// 	this.toDoItemService = toDoItemService;
	// 	this.botName = botName;
	// }

	public ToDoItemBotController(String botToken, String botName, ToDoItemService toDoItemService, TareaService tareaService, EstadoService estadoService) {
        super(botToken);
        this.toDoItemService = toDoItemService;
        this.tareaService = tareaService;
		this.estadoService = estadoService;
        this.botName = botName;
    }

	@Override
	public void onUpdateReceived(Update update) {

		if (update.hasMessage() && update.getMessage().hasText()) {

			String messageTextFromTelegram = update.getMessage().getText();
			long chatId = update.getMessage().getChatId();

			// Verificar si el chat tiene un proceso de creación de tarea pendiente
			if (pendingTaskCreations.containsKey(chatId)) {
				TaskCreationState state = pendingTaskCreations.get(chatId);
				// Paso 1: Se espera el nombre de la tarea
				if (state.getStep() == 1) {
					state.setTaskName(messageTextFromTelegram);
					state.setStep(2);
					BotHelper.sendMessageToTelegram(chatId, "Ingrese las horas estimadas (máximo 4 horas):", this);
					return;
				}
				// Paso 2: Se espera el ingreso de las horas estimadas
				else if (state.getStep() == 2) {
					try {
						double horas = Double.parseDouble(messageTextFromTelegram);
						if (horas > 4) {
							BotHelper.sendMessageToTelegram(chatId,
									"El máximo permitido es 4 horas. Por favor, ingrese un valor válido:", this);
							return;
						}
						state.setHoursEstimated(horas);

						// Construir la tarea
						Tarea newTarea = new Tarea();
						newTarea.setNombreTarea(state.getTaskName());
						newTarea.setFechaRegistro(java.time.LocalDate.now());
						newTarea.setFechaFin(java.time.LocalDate.now().plusDays(2));
						newTarea.setHorasEstimadas(horas);
						newTarea.setHorasReales(null);

						// Asignar un sprint por defecto (asegúrate de que exista un sprint con este ID)
						// Nota: Ajusta esta parte según la lógica de tu aplicación
						Sprint defaultSprint = new Sprint();
						defaultSprint.setIdSprint(1);
						newTarea.setSprint(defaultSprint);

						tareaService.addTarea(newTarea);
						BotHelper.sendMessageToTelegram(chatId, "Tarea agregada correctamente.", this);
					} catch (NumberFormatException e) {
						BotHelper.sendMessageToTelegram(chatId,
								"Por favor, ingrese un número válido para las horas estimadas:", this);
						return;
					}
					// Eliminar el estado una vez completado el flujo
					pendingTaskCreations.remove(chatId);
					return;
				}
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
			
			if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// first row
				KeyboardRow row = new KeyboardRow();
				row.add(BotLabels.LIST_ALL_ITEMS.getLabel());
				row.add(BotLabels.ADD_NEW_ITEM.getLabel());
				row.add(BotLabels.LIST_ALL_TAREAS.getLabel());
				row.add(BotLabels.INICIAR_TAREA.getLabel());

				// Add the first row to the keyboard
				keyboard.add(row);

				// second row
				row = new KeyboardRow();
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

			}	else if (messageTextFromTelegram.equals(BotLabels.COMPLETE_TASK.getLabel())) {
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
						String completeButton = tarea.getIdTarea() + BotLabels.DASH.getLabel() + BotLabels.COMPLETE_TASK.getLabel();
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

			}  else if (messageTextFromTelegram.contains(BotLabels.COMPLETE_TASK.getLabel())
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
			
			} if (messageTextFromTelegram.equals(BotLabels.AGREGAR_TAREA.getLabel())) {
				TaskCreationState state = new TaskCreationState();
				state.setStep(1); // Comenzar pidiendo el nombre de la tarea
				pendingTaskCreations.put(chatId, state);
				BotHelper.sendMessageToTelegram(chatId, "Ingrese el nombre de la tarea:", this);
				return;

			} else if (messageTextFromTelegram.equals(BotLabels.INICIAR_TAREA.getLabel())) {
				// Obtener la lista de todas las tareas y filtrar solo las que están "Pendiente"
				List<Tarea> todasTareas = getAllTareas();
				List<Tarea> tareasPendientes = new ArrayList<>();
				for (Tarea tarea : todasTareas) {
					ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(tarea.getIdTarea());
					if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						String estado = estadoResponse.getBody().getEstado();
						if (estado.equals("Pendiente")) {
							tareasPendientes.add(tarea);
						}
					}
				}
			
				if (tareasPendientes.isEmpty()) {
					BotHelper.sendMessageToTelegram(chatId, "No hay tareas pendientes para iniciar.", this);
				} else {
					// Crear teclado en 2 columnas: una columna con información de la tarea y otra con el botón para iniciar.
					ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
					List<KeyboardRow> keyboard = new ArrayList<>();
			
					for (Tarea tarea : tareasPendientes) {
						KeyboardRow row = new KeyboardRow();
						String infoButton = "[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea();
						String iniciarButton = tarea.getIdTarea() + BotLabels.DASH.getLabel() + BotLabels.INICIAR_TAREA.getLabel();
						row.add(infoButton);
						row.add(iniciarButton);
						keyboard.add(row);
					}
					// Botón para regresar a la pantalla principal
					KeyboardRow mainScreenRow = new KeyboardRow();
					mainScreenRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRow);
			
					keyboardMarkup.setKeyboard(keyboard);
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText("Selecciona la tarea pendiente a iniciar:");
					messageToTelegram.setReplyMarkup(keyboardMarkup);
					try {
						execute(messageToTelegram);
					} catch (TelegramApiException e) {
						logger.error(e.getLocalizedMessage(), e);
					}
				}
			}
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
							BotHelper.sendMessageToTelegram(chatId, "Tarea " + taskId + " iniciada y ahora en progreso.", this);
						} else {
							BotHelper.sendMessageToTelegram(chatId, "La tarea " + taskId + " no se encuentra en estado Pendiente.", this);
						}
					} else {
						BotHelper.sendMessageToTelegram(chatId, "No se encontró la tarea con id " + taskId, this);
					}
				} catch (Exception e) {
					logger.error("Error al procesar Iniciar Tarea", e);
					BotHelper.sendMessageToTelegram(chatId, "Error al procesar la tarea. Por favor, intenta nuevamente.", this);
				}

			} else if (messageTextFromTelegram.indexOf(BotLabels.DONE.getLabel()) != -1) {

				String done = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(done);

				try {

					ToDoItem item = getToDoItemById(id).getBody();
					item.setDone(true);
					updateToDoItem(item, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.indexOf(BotLabels.UNDO.getLabel()) != -1) {

				String undo = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(undo);

				try {

					ToDoItem item = getToDoItemById(id).getBody();
					item.setDone(false);
					updateToDoItem(item, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.indexOf(BotLabels.DELETE.getLabel()) != -1) {

				String delete = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(delete);

				try {

					deleteToDoItem(id).getBody();
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotCommands.HIDE_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {

				BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), this);

			} else if (messageTextFromTelegram.equals(BotCommands.TODO_LIST.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
					|| messageTextFromTelegram.equals(BotLabels.MY_TODO_LIST.getLabel())) {

				List<ToDoItem> allItems = getAllToDoItems();
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// command back to main screen
				KeyboardRow mainScreenRowTop = new KeyboardRow();
				mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowTop);

				KeyboardRow firstRow = new KeyboardRow();
				firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
				keyboard.add(firstRow);

				KeyboardRow myTodoListTitleRow = new KeyboardRow();
				myTodoListTitleRow.add(BotLabels.MY_TODO_LIST.getLabel());
				keyboard.add(myTodoListTitleRow);

				List<ToDoItem> activeItems = allItems.stream().filter(item -> item.isDone() == false)
						.collect(Collectors.toList());

				for (ToDoItem item : activeItems) {

					KeyboardRow currentRow = new KeyboardRow();
					currentRow.add(item.getDescription());
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
					keyboard.add(currentRow);
				}

				List<ToDoItem> doneItems = allItems.stream().filter(item -> item.isDone() == true)
						.collect(Collectors.toList());

				for (ToDoItem item : doneItems) {
					KeyboardRow currentRow = new KeyboardRow();
					currentRow.add(item.getDescription());
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
					keyboard.add(currentRow);
				}

				// command back to main screen
				KeyboardRow mainScreenRowBottom = new KeyboardRow();
				mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowBottom);

				keyboardMarkup.setKeyboard(keyboard);

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText(BotLabels.MY_TODO_LIST.getLabel());
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotLabels.LIST_ALL_TAREAS.getLabel())) {
				// Recuperar la lista de Tareas desde la base de datos
				List<Tarea> tareas = getAllTareas();

				// Construir el teclado para mostrar las Tareas
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// Botón para volver a la pantalla principal
				KeyboardRow topRow = new KeyboardRow();
				topRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(topRow);

				// Agregar una fila por cada tarea (por ejemplo, mostrando el nombre y el id)
				for (Tarea tarea : tareas) {
					KeyboardRow row = new KeyboardRow();
					// Puedes personalizar la información que se muestra. Por ejemplo:
					row.add("[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea());
					keyboard.add(row);
				}

				// Botón inferior para regresar a la pantalla principal
				KeyboardRow bottomRow = new KeyboardRow();
				bottomRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(bottomRow);

				keyboardMarkup.setKeyboard(keyboard);

				// Enviar el mensaje al usuario con la lista de Tareas
				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText("Lista de Tareas:");
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.equals(BotCommands.ADD_ITEM.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.ADD_NEW_ITEM.getLabel())) {
				try {
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.TYPE_NEW_TODO_ITEM.getMessage());
					// hide keyboard
					ReplyKeyboardRemove keyboardMarkup = new ReplyKeyboardRemove(true);
					messageToTelegram.setReplyMarkup(keyboardMarkup);

					// send message
					execute(messageToTelegram);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			}

			else {
				try {
					ToDoItem newItem = new ToDoItem();
					newItem.setDescription(messageTextFromTelegram);
					newItem.setCreation_ts(OffsetDateTime.now());
					newItem.setDone(false);
					ResponseEntity entity = addToDoItem(newItem);

					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.NEW_ITEM_ADDED.getMessage());

					execute(messageToTelegram);
				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			}
		}
	}

	@Override
	public String getBotUsername() {		
		return botName;
	}

	// GET /todolist
	public List<ToDoItem> getAllToDoItems() { 
		return toDoItemService.findAll();
	}

	public List<Tarea> getAllTareas() {
		return tareaService.findAll();
	}

	// GET BY ID /todolist/{id}
	public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id) {
		try {
			ResponseEntity<ToDoItem> responseEntity = toDoItemService.getItemById(id);
			return new ResponseEntity<ToDoItem>(responseEntity.getBody(), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// PUT /todolist
	public ResponseEntity addToDoItem(@RequestBody ToDoItem todoItem) throws Exception {
		ToDoItem td = toDoItemService.addToDoItem(todoItem);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("location", "" + td.getID());
		responseHeaders.set("Access-Control-Expose-Headers", "location");
		// URI location = URI.create(""+td.getID())

		return ResponseEntity.ok().headers(responseHeaders).build();
	}

	// UPDATE /todolist/{id}
	public ResponseEntity updateToDoItem(@RequestBody ToDoItem toDoItem, @PathVariable int id) {
		try {
			ToDoItem toDoItem1 = toDoItemService.updateToDoItem(id, toDoItem);
			System.out.println(toDoItem1.toString());
			return new ResponseEntity<>(toDoItem1, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

	// DELETE todolist/{id}
	public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id) {
		Boolean flag = false;
		try {
			flag = toDoItemService.deleteToDoItem(id);
			return new ResponseEntity<>(flag, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(flag, HttpStatus.NOT_FOUND);
		}
	}

}