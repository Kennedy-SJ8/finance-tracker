// Diagnostic script to test backend connections for finance-tracker
const { createClient } = require('@supabase/supabase-js');

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz-wLH8VTEh3jhdsJjYU3s7vTkqH8n4tsQVGO8-zVBxVPQne1rvcP-uCIARKKwCAnPVLQ/exec';
const SUPABASE_URL = 'https://qrvuzgnuawekmyhatspw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydnV6Z251YXdla215aGF0c3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MTQwMzIsImV4cCI6MjEwNjI5MDAzMn0.4idMtCo1qcxYB_9S5i6TkJEVaAdmZkiV5WtmHBtIWzk';

async function testGoogleSheets() {
  console.log('\n--- 1. Probando Google Sheets (Apps Script) ---');
  try {
    const start = Date.now();
    const res = await fetch(`${WEB_APP_URL}?action=dashboard`);
    const data = await res.json();
    const elapsed = Date.now() - start;
    if (data.status === 'success') {
      console.log(`✅ Google Sheets responde correctamente (${elapsed}ms):`);
      console.log(`   Balance disponible: S/. ${data.balance_disponible}`);
      console.log(`   Ingresos: S/. ${data.ingresos} | Gastos: S/. ${data.gastos}`);
      console.log(`   Movimientos encontrados: ${data.movimientos_recientes?.length || 0}`);
      console.log(`   Presupuestos encontrados: ${data.presupuestos?.length || 0}`);
      return true;
    } else {
      console.log('⚠️ Google Sheets respondió con estado no exitoso:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ Error al conectar con Google Sheets:', err.message);
    return false;
  }
}

async function testSupabase() {
  console.log('\n--- 2. Probando Supabase ---');
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const start = Date.now();
    const { data, error } = await supabase.from('movimientos').select('id').limit(1);
    const elapsed = Date.now() - start;
    if (error) {
      console.log(`❌ Supabase devolvió error (${elapsed}ms):`, error.message);
      return false;
    }
    console.log(`✅ Supabase responde correctamente (${elapsed}ms):`, data);
    return true;
  } catch (err) {
    console.error('❌ Excepción al conectar con Supabase:', err.message);
    return false;
  }
}

async function main() {
  console.log('=== TEST DE CONEXIÓN DE BACKEND (Finance Tracker) ===');
  const gsOk = await testGoogleSheets();
  const sbOk = await testSupabase();
  console.log('\n=== RESUMEN ===');
  console.log(`Google Sheets : ${gsOk ? '🟢 ACTIVO' : '🔴 INACTIVO'}`);
  console.log(`Supabase      : ${sbOk ? '🟢 ACTIVO' : '🔴 INACTIVO'}`);
}

main();
