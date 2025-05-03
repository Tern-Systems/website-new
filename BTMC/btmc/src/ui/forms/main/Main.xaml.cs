using System.Windows;
using System.Windows.Input;

namespace btmc
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private enum _TabEnum { BTMC, TERN };
        private _TabEnum _activeTab = _TabEnum.BTMC;

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ButtonState == MouseButtonState.Pressed)
                DragMove();
        }

        private void Toggle_Click(object sender, RoutedEventArgs e)
        {
            if (BtmcToggle.IsChecked == true)
            {
                BtmcPanel.Visibility = Visibility.Visible;
                TernPanel.Visibility = Visibility.Collapsed;
                _activeTab = _TabEnum.BTMC;
            }
            else if (TernToggle.IsChecked == true)
            {
                BtmcPanel.Visibility = Visibility.Collapsed;
                TernPanel.Visibility = Visibility.Visible;
                _activeTab = _TabEnum.TERN;
            }
        }

        private void Copy_Click(object sender, RoutedEventArgs e)
        {
            if (_activeTab == _TabEnum.BTMC)
            {
                Clipboard.SetText(OutputBox.Text);
            }
            else if (_activeTab == _TabEnum.TERN)
            {
                Clipboard.SetText(TernOutputBox.Text);
            }
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            if (_activeTab == _TabEnum.BTMC)
            {
                InputBox1.Text = string.Empty;
                OutputBox.Text = string.Empty;
            }
            else if (_activeTab == _TabEnum.TERN)
            {
                Input1Box.Text = string.Empty;
                Input2Box.Text = string.Empty;
                TernOutputBox.Text = string.Empty;
                InstructionBox.SelectedIndex = -1;
            }
        }

        private void InputBox1_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {

        }
    }
}
