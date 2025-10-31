using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace DemoStrategy3D.Strategy
{
    public class MoveForwardStrategy : IDirectionStrategy
    {
        public async Task ExecuteAsync(IJSRuntime js)
        {
            await js.InvokeVoidAsync("moveForward");
        }
    }
}
