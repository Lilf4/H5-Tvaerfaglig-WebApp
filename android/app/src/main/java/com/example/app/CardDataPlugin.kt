package com.example.app

import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "CardData")
class CardDataPlugin : Plugin() {
    init {
        android.util.Log.d("CardDataPlugin", "CLASS LOADED")
    }

    @PluginMethod
    fun set(call: PluginCall) {
        val hex = call.getString("hex") ?: ""
        // store hex somewhere static / singleton
        call.resolve()
    }
}
