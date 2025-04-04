package com.springboot.MyTodoList.util;

public enum BotLabels {
	
    SHOW_MAIN_SCREEN("Show Main Screen"), 
    HIDE_MAIN_SCREEN("Hide Main Screen"),
    LIST_ALL_ITEMS("List All Items"), 
    ADD_NEW_ITEM("Add New Item"),
    LIST_ALL_TAREAS("List All Tareas"),  // <-- Nueva etiqueta
    INICIAR_TAREAS("Iniciar Tareas"), 
    COMPLETE_TASK("Complete Task"),
    DONE("DONE"),
    CANCELAR("CANCELAR"),   
    UNDO("UNDO"),
    DELETE("DELETE"),
    INICIAR_TAREA("Iniciar Tarea"),
    MY_TODO_LIST("MY TODO LIST"), 
    DASH("-");
	

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
