using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.components
{
    public partial class SwapButtonControl : UserControl
    {
        public event RoutedEventHandler SwapClicked;

        public static readonly DependencyProperty ToolTipTextProperty =
            DependencyProperty.Register("ToolTipText", typeof(string), typeof(SwapButtonControl),
                new PropertyMetadata("Swap items"));

        public string ToolTipText
        {
            get { return (string)GetValue(ToolTipTextProperty); }
            set { SetValue(ToolTipTextProperty, value); }
        }

        public SwapButtonControl()
        {
            InitializeComponent();
        }

        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            SwapClicked?.Invoke(this, new RoutedEventArgs());
        }
    }
}
