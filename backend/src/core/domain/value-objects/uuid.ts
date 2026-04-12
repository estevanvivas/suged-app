import {validate as validateUUID} from "uuid";
import {InvalidUUIDError} from "@/core/domain/errors/invalid-uuid.error";

export class UUID {

    private constructor(
        public readonly value: string
    ) {
    }

    equals(other: UUID): boolean {
        return this.value === other.value;
    }

    static create(value: string): UUID {

        if (!validateUUID(value))
            throw new InvalidUUIDError();

        return new UUID(value);
    }

    static generate(): UUID {
        return new UUID(crypto.randomUUID());
    }
}
