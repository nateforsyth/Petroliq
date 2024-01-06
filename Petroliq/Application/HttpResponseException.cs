namespace Petroliq_API.Application
{
#pragma warning disable CS1591
    public class HttpResponseException : Exception
    {
        public HttpResponseException(int statusCode, object? value = null) =>
            (StatusCode, Value) = (statusCode, value);

        public int StatusCode { get; }

        public object? Value { get; }
    }
#pragma warning restore CS1591
}
