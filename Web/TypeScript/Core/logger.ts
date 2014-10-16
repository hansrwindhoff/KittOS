enum LogFlags {
    None = 0,       // 0
    Debug = 1,      // 1
    Info = 1 << 1,  // 2
    Warn = 1 << 2,  // 4
    Error = 1 << 3, // 8
} 