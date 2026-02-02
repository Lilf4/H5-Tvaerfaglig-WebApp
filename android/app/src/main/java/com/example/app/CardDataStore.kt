package com.example.app

import android.content.Context
import androidx.core.content.edit

object CardDataStore {
    private const val PREFS = "hce_prefs"
    private const val KEY = "card_data"

    fun set(context: Context, hexData: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit {
                putString(KEY, hexData)
            }
    }

    fun get(context: Context): ByteArray {
        val hex = context
            .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY, "48656C6C6F")!! // "Hello"
        return hex(hex)
    }
}
