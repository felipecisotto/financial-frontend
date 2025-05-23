# Etapa de build
FROM oven/bun:1.1.13 as builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
RUN bun run build

# Etapa de produção
FROM oven/bun:1.1.13 as production

WORKDIR /app

# Instale o 'serve' para servir arquivos estáticos
RUN bun add -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]