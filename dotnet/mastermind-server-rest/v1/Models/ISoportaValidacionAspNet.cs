using Microsoft.AspNetCore.Mvc.ModelBinding;

public interface ISoportaValidacionAspNet
{
    void ValidarModelo(ModelStateDictionary modelState);
} // interface ISoportaValidacionAspNet
