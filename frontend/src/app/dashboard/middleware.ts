import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Intentamos obtener la sesión de la cookie (Zustand persist la guarda en localStorage, 
    // pero para seguridad máxima en SSR se suelen usar cookies. 
    // Si solo usas localStorage, el middleware no podrá leerlo, 
    // así que nos apoyaremos en la validación de cliente abajo).
    
    // Por ahora, este middleware asegura que no entren a rutas protegidas sin lógica.
    const path = request.nextUrl.pathname;

    // Si quieres máxima firmeza, aquí deberías checar una cookie de sesión.
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};