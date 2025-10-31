using Microsoft.JSInterop;
using System.Threading.Tasks;
namespace DemoStrategy3D.Strategy
{
    public class TurnRightStrategy : IDirectionStrategy
    {
        public async Task ExecuteAsync(IJSRuntime js)
        {
            await js.InvokeVoidAsync("threeJSInterop.turnRight");
        }
    }
}