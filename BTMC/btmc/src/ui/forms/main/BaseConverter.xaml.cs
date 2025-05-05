using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main
{
    public partial class BaseConverter : UserControl
    {
        public BaseConverter()
        {
            InitializeComponent();
        }

        private void BTMCToggle_Checked(object sender, RoutedEventArgs e)
        {
            if (BTMCLayout != null && TERNLayout != null && TERNToggle != null)
            {
                BTMCLayout.Visibility = Visibility.Visible;
                TERNLayout.Visibility = Visibility.Collapsed;
                TERNToggle.IsChecked = false;
            }
        }

        private void TERNToggle_Checked(object sender, RoutedEventArgs e)
        {
            if (BTMCLayout != null && TERNLayout != null && BTMCToggle != null)
            {
                BTMCLayout.Visibility = Visibility.Collapsed;
                TERNLayout.Visibility = Visibility.Visible;
                BTMCToggle.IsChecked = false;
            }
        }
    }
}
