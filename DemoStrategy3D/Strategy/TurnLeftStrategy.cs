using Microsoft.JSInterop;
using System.Threading.Tasks;
namespace DemoStrategy3D.Strategy
{
    public class TurnLeftStrategy : IDirectionStrategy
    {
        public async Task ExecuteAsync(IJSRuntime js)
        {
            await js.InvokeVoidAsync("threeJSInterop.turnLeft");
        }
    }
}