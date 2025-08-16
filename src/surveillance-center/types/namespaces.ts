// src/surveillance-center/types/namespaces.ts
export namespace Camera {
    export interface Device { /* camera-specific */ }
    export interface Settings { /* camera-specific */ }
    export interface Status { /* camera-specific */ }
}

export namespace Security {
    export interface Event { /* security-specific */ }
    export interface Alert { /* security-specific */ }
    export interface Metrics { /* security-specific */ }
}

export namespace Analytics {
    export interface Detection { /* analytics-specific */ }
    export interface Rule { /* analytics-specific */ }
    export interface Report { /* analytics-specific */ }
}

export namespace Storage {
    export interface Video { /* storage-specific */ }
    export interface Policy { /* storage-specific */ }
    export interface Archive { /* storage-specific */ }
}