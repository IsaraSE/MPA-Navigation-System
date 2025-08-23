export default function requireRoles(...allowed) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json ({ message: "unauthorized "});
        if (!allowed.include(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: No role assigned" });
    }
    next();

   };
}