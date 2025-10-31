using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace DemoStrategy3D.Strategy
{
    public interface IDirectionStrategy
    {
        Task ExecuteAsync(IJSRuntime js);
    }
}
