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
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.EstadoService;
import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.service.ToDoItemService;
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

	// ---------------------------------------
	private TareaService tareaService;
	private EstadoService estadoService;

	private Map<Long, Integer> pendingCompletionTasks = new HashMap<>();
	// ----------------------------------------

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

			    // Comprobar si se envía el comando de cancelación
			if (messageTextFromTelegram.equalsIgnoreCase("/cancel") ||
					messageTextFromTelegram.equalsIgnoreCase(BotLabels.CANCELAR.getLabel())) {
				 // Limpia el mapa de creación de tareas (si se usa)
				pendingCompletionTasks.clear(); // Limpia el mapa de tareas pendientes de completar
				BotHelper.sendMessageToTelegram(chatId, "Proceso cancelado. Se han limpiado las sesiones pendientes.",
						this);
				return;
			}

			// 1. Verificar si hay una tarea pendiente de completar
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
				// Una vez procesado, se elimina la tarea pendiente para este chat
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
				row.add(BotLabels.LIST_ALL_TAREAS.getLabel());
				row.add(BotLabels.ADD_NEW_ITEM.getLabel());
				row.add(BotLabels.CANCELAR.getLabel());
				
				
				// Add the first row to the keyboard
				keyboard.add(row);

				// second row
				row = new KeyboardRow();
				row.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				row.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
				row.add(BotLabels.INICIAR_TAREAS.getLabel());
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

			} else if (messageTextFromTelegram.equalsIgnoreCase("/cancel") ||
					messageTextFromTelegram.equalsIgnoreCase(BotLabels.CANCELAR.getLabel())) {
				// Limpia todos los mapas de sesiones pendientes
				
				pendingCompletionTasks.clear();
				BotHelper.sendMessageToTelegram(chatId, "Proceso cancelado. Se han limpiado las sesiones pendientes.",
						this);
				return;
			
			}  else if (messageTextFromTelegram.indexOf(BotLabels.DONE.getLabel()) != -1) {

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
				List<Tarea> allTareas = getAllTareas();

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

			} else if (messageTextFromTelegram.equals(BotLabels.INICIAR_TAREAS.getLabel())) {
				// Recuperar todas las tareas y filtrar las pendientes
				List<Tarea> tareas = getAllTareas();
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();
			
				// Botón superior para volver a la pantalla principal
				KeyboardRow topRow = new KeyboardRow();
				topRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(topRow);
			
				for (Tarea tarea : tareas) {
					ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(tarea.getIdTarea());
					if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						// Se filtran solo las tareas con estado "Pendiente"
						if ("Pendiente".equalsIgnoreCase(estadoResponse.getBody().getEstado())) {
							KeyboardRow row = new KeyboardRow();
							// Muestra el ID y nombre de la tarea
							row.add("[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea());
							// Botón para iniciar la tarea, se envía en formato: "ID-DASH-Iniciar Tarea"
							row.add(tarea.getIdTarea() + BotLabels.DASH.getLabel() + BotLabels.INICIAR_TAREA.getLabel());
							keyboard.add(row);
						}
					}
				}
			
				// Botón inferior para regresar a la pantalla principal
				KeyboardRow bottomRow = new KeyboardRow();
				bottomRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(bottomRow);
			
				keyboardMarkup.setKeyboard(keyboard);
			
				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText("Tareas Pendientes para Iniciar:");
				messageToTelegram.setReplyMarkup(keyboardMarkup);
			
				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.contains(BotLabels.INICIAR_TAREA.getLabel())) {
				try {
					 // Se asume que el mensaje tiene el formato "ID-DASH-Iniciar Tarea", por ejemplo: "123-Iniciar Tarea"
					 int dashIndex = messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel());
					 String idStr = messageTextFromTelegram.substring(0, dashIndex);
					 int taskId = Integer.parseInt(idStr);
			
					 // Obtener el estado actual de la tarea y actualizarlo a "En progreso"
					 ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(taskId);
					 if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						 Estado estado = estadoResponse.getBody();
						 estado.setEstado("En progreso");
						 estadoService.updateEstado(taskId, estado);
						 BotHelper.sendMessageToTelegram(chatId, "Tarea " + taskId + " marcada como 'En progreso'.", this);
					 } else {
						 BotHelper.sendMessageToTelegram(chatId, "No se encontró la tarea " + taskId, this);
					 }
				} catch (Exception e) {
					 logger.error("Error al iniciar tarea", e);
					 BotHelper.sendMessageToTelegram(chatId, "Error al iniciar la tarea.", this);
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

			} else if (messageTextFromTelegram.equals(BotLabels.LIST_ALL_TAREAS.getLabel())) {
				// Recuperar la lista de Tareas desde la base de datos
				List<Tarea> tareas = getAllTareas();

				// Construir el teclado para mostrar las Tareas con estado
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// Botón superior para volver a la pantalla principal
				KeyboardRow topRow = new KeyboardRow();
				topRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(topRow);

				// Por cada tarea, agregar una fila con dos botones: uno para el nombre y otro
				// para el estado
				for (Tarea tarea : tareas) {
					KeyboardRow row = new KeyboardRow();
					ResponseEntity<Estado> estadoResponse = estadoService.getEstadoById(tarea.getIdTarea());
					String estadoTexto = "";
					if (estadoResponse.getStatusCode() == HttpStatus.OK && estadoResponse.getBody() != null) {
						estadoTexto = estadoResponse.getBody().getEstado();
					}
					row.add("[" + tarea.getIdTarea() + "] " + tarea.getNombreTarea());
					row.add(estadoTexto);
					// Agregar botón de "Complete Task" si la tarea no está ya completada
					if (!"Completada".equalsIgnoreCase(estadoTexto)) {
						row.add(tarea.getIdTarea() + BotLabels.DASH.getLabel() + BotLabels.COMPLETE_TASK.getLabel());
					}
					keyboard.add(row);
				}

				// Botón inferior para regresar a la pantalla principal
				KeyboardRow bottomRow = new KeyboardRow();
				bottomRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(bottomRow);

				keyboardMarkup.setKeyboard(keyboard);

				// Enviar el mensaje al usuario con la lista de Tareas actualizada
				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText("Lista de Tareas:");
				messageToTelegram.setReplyMarkup(keyboardMarkup);


				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
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



















// -------------------------------------------------------------------------------------