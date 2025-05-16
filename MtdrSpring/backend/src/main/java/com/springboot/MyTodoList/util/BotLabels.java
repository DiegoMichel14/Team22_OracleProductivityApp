package com.springboot.MyTodoList.util;

public enum BotLabels {
	
	SHOW_MAIN_SCREEN("Show Main Screen"), 
	
	HIDE_MAIN_SCREEN("Hide Main Screen"),
	LIST_ALL_ITEMS("List All Items"), 
	LIST_ALL_TAREAS("Lista Mis Tareas"),
	INICIAR_TAREA("Iniciar tarea"),
	COMPLETE_TASK("Completar tarea"),
	AGREGAR_TAREA("Agregar tarea"),
	ADD_NEW_ITEM("Add New Item"),
	DONE("DONE"),
	UNDO("UNDO"),
	DELETE("DELETE"),
	MY_TODO_LIST("MY TODO LIST"),
	DASH("-"),
	LIST_COMPLETED_TASKS("tareas completadas en sprint"),
	LIST_P_TASKS("tareas Pendientes en sprint");
	


	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
