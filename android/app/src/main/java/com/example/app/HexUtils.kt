package com.example.app

fun hex(s: String): ByteArray =
    s.chunked(2).map { it.toInt(16).toByte() }.toByteArray()

fun ByteArray.toHex(): String =
    joinToString("") { "%02X".format(it) }
