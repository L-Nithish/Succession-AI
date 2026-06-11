const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${BASE_URL}${path}`;
  
  // Set headers
  const headers = new Headers(options.headers);
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure content-type is json by default if sending body, except for FormData (multipart upload)
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions = {
    ...options,
    headers
  };

  let response = await fetch(url, fetchOptions);

  // Auto refresh token interceptor on 401 Unauthorized
  if (response.status === 401 && path !== "/auth/login" && path !== "/auth/refresh") {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem("refreshToken") : null;
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const authData = await refreshResponse.json();
          
          if (typeof window !== 'undefined') {
            localStorage.setItem("accessToken", authData.accessToken);
            localStorage.setItem("refreshToken", authData.refreshToken);
          }

          // Retry the original request with new token
          headers.set("Authorization", `Bearer ${authData.accessToken}`);
          response = await fetch(url, { ...options, headers });
        } else {
          // Refresh failed - log out
          if (typeof window !== 'undefined') {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/"; // redirect to landing
          }
        }
      } catch (err) {
        console.error("Failed to auto-refresh token:", err);
      }
    }
  }

  return response;
}
