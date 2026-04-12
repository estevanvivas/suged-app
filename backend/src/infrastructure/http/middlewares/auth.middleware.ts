import type {NextFunction, Request, Response} from "express";
import {supabaseClient} from "../../database/supabase/client";
import {UnauthorizedError} from "../../../shared/errors/UnauthorizedError";
import {ForbiddenError} from "../../../shared/errors/ForbiddenError";

const BEARER_PREFIX = "Bearer ";
const ADMIN_ROLE = "ADMIN";

const extractBearerToken = (authorizationHeader?: string): string => {
    if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
        throw new UnauthorizedError("Token no proporcionado o formato invalido.");
    }

    const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
    if (!token) {
        throw new UnauthorizedError("Token no proporcionado o formato invalido.");
    }

    return token;
};

const getUserRole = async (userId: string): Promise<string | null> => {
    const {data, error} = await supabaseClient
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single();

    if (error) {
        throw new UnauthorizedError("No se pudo cargar el perfil del usuario.");
    }

    return data?.rol ?? null;
};

export const verifyToken = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {

    const token = extractBearerToken(req.headers.authorization);

    const {
        data: {user},
        error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
        throw new UnauthorizedError("Token invalido o expirado.");
    }

    req.user = {
        id: user.id,
        rol: await getUserRole(user.id),
    };

    next();
};

export const requireAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        throw new UnauthorizedError("Usuario no autenticado.");
    }

    if (req.user.rol !== ADMIN_ROLE) {
        throw new ForbiddenError("Acceso denegado. Se requieren privilegios de administrador.");
    }

    next();
};

export const requireAuthenticatedAdmin = [verifyToken, requireAdmin]