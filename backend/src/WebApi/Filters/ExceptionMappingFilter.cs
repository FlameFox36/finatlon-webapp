using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebApi.Filters;

public sealed class ExceptionMappingFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        context.Result = context.Exception switch
        {
            DomainException ex => new BadRequestObjectResult(
                new { error = ex.Message }),

            ApplicationException ex => new ConflictObjectResult(
                new { error = ex.Message }),

            _ => new ObjectResult(
                new { error = "Internal server error" })
            {
                StatusCode = 500
            }
        };

        context.ExceptionHandled = true;
    }
}
