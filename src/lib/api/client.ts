import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly kind: "validation" | "server" | "network" | "timeout" | "contract" | "config",
  ) {
    const messages = {
      validation: "입력 내용을 처리할 수 없습니다. 연도와 금액을 확인해 주세요.",
      server: "서버가 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      network: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.",
      timeout: "응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
      contract: "응답 형식을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      config: "실제 진단 연결이 준비되지 않았습니다. 공식 가이드를 이용해 주세요.",
    };
    super(messages[kind]);
    this.name = "ApiError";
  }
}
export async function request<T>(
  base: string,
  path: string,
  schema: z.ZodType<T>,
  input?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const timeout = AbortSignal.timeout(12_000);
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      method: input === undefined ? "GET" : "POST",
      headers: {
        Accept: "application/json",
        ...(input === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(input === undefined ? {} : { body: JSON.stringify(input) }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok)
      throw new ApiError([400, 422].includes(response.status) ? "validation" : "server");
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new ApiError("contract");
    }
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new ApiError("contract");
    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    throw new ApiError(timeout.aborted ? "timeout" : "network");
  }
}
