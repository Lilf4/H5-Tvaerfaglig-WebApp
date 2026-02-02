package com.example.app

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log

class MyCardService : HostApduService() {

    private val SELECT_HEADER = byteArrayOf(
        0x00, 0xA4.toByte(), 0x04, 0x00
    )

    private val AID = hex("F0010203040506")
    private val OK = hex("9000")

    override fun processCommandApdu(apdu: ByteArray, extras: Bundle?): ByteArray {
        Log.d("HCE", "APDU: ${apdu.toHex()}")

        // Only respond to SELECT AID
        if (isSelectAid(apdu)) {
            return CardDataStore.get(this) + OK
        }

        return hex("6F00") // error
    }

    override fun onDeactivated(reason: Int) {}

    private fun isSelectAid(apdu: ByteArray): Boolean {
        if (apdu.size < 5) return false
        if (!apdu.copyOfRange(0, 4).contentEquals(SELECT_HEADER)) return false

        val len = apdu[4].toInt()
        val aid = apdu.copyOfRange(5, 5 + len)
        return aid.contentEquals(AID)
    }
}
